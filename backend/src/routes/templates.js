import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth.js'

const prisma = new PrismaClient()
const router = Router()

router.get('/', async (req, res) => {
  const templates = await prisma.template.findMany()
  res.json(templates)
})

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const template = await prisma.template.findUnique({ where: { id } })
  if (!template) return res.status(404).json({ message: 'Not found' })
  res.json(template)
})

// Create presentation from template with all its slides and elements
router.post('/:id/use', authMiddleware, async (req, res) => {
  try {
    const templateId = Number(req.params.id)
    const { title } = req.body
    
    // Find the template
    const template = await prisma.template.findUnique({ where: { id: templateId } })
    if (!template) return res.status(404).json({ message: 'Template not found' })
    
    // Find the richest sample presentation for this template.
    // Fallbacks: titles containing Sample/サンプル or template name even if templateId is missing.
    const candidates = await prisma.presentation.findMany({
      where: {
        OR: [
          { templateId },
          { title: { contains: 'サンプル' } },
          { title: { contains: 'Sample' } },
          template.name ? { title: { contains: template.name } } : undefined
        ].filter(Boolean)
      },
      include: {
        slides: {
          include: { elements: true },
          orderBy: { orderIndex: 'asc' }
        }
      }
    })

    // Prefer titles containing Sample/サンプル, otherwise pick the one with the most slides
    const withLabel = candidates.filter(p => p.title?.includes('サンプル') || p.title?.includes('Sample'))
    const byLength = (a, b) => (b.slides?.length || 0) - (a.slides?.length || 0)
    const samplePres = (withLabel.sort(byLength)[0]) || (candidates.sort(byLength)[0])

    if (!samplePres || !samplePres.slides?.length) {
      console.error('No sample presentation found. Candidates:', candidates.length)
      return res.status(404).json({ message: 'No sample presentation with slides found for this template' })
    }
    
    console.log(`Creating presentation from template ${templateId}, copying ${samplePres.slides.length} slides`)
    
    // Use transaction to ensure all slides are created atomically
    const result = await prisma.$transaction(async (tx) => {
      // Create new presentation for current user
      const newPresentation = await tx.presentation.create({
        data: {
          userId: req.userId,
          title: title || `My ${template.name}`,
          templateId: templateId
        }
      })
      
      console.log(`Created presentation ${newPresentation.id}`)
      
      // Copy all slides and elements in sequence
      for (const sampleSlide of samplePres.slides) {
        const newSlide = await tx.slide.create({
          data: {
            presentationId: newPresentation.id,
            title: sampleSlide.title,
            content: sampleSlide.content,
            orderIndex: sampleSlide.orderIndex
          }
        })
        
        console.log(`Created slide ${newSlide.id}: ${newSlide.title}`)
        
        // Copy elements
        if (sampleSlide.elements && sampleSlide.elements.length > 0) {
          await tx.element.createMany({
            data: sampleSlide.elements.map(elem => ({
              slideId: newSlide.id,
              type: elem.type,
              x: elem.x,
              y: elem.y,
              width: elem.width,
              height: elem.height,
              zIndex: elem.zIndex,
              rotation: elem.rotation,
              data: elem.data
            }))
          })
          console.log(`Copied ${sampleSlide.elements.length} elements to slide ${newSlide.id}`)
        }
      }
      
      return newPresentation
    })
    
    // Fetch the complete presentation with all slides after transaction commits
    const fullPresentation = await prisma.presentation.findUnique({
      where: { id: result.id },
      include: {
        slides: {
          include: {
            elements: true
          },
          orderBy: { orderIndex: 'asc' }
        }
      }
    })
    
    console.log(`✅ Template use complete: presentation ${fullPresentation.id} with ${fullPresentation.slides.length} slides`)
    console.log('Slide IDs:', fullPresentation.slides.map(s => s.id).join(', '))
    res.json(fullPresentation)
  } catch (error) {
    console.error('Error creating presentation from template:', error)
    res.status(500).json({ message: 'Failed to create presentation from template' })
  }
})

export default router
