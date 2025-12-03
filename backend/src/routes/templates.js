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
    
    // Find the sample presentation for this template
    const samplePres = await prisma.presentation.findFirst({
      where: { 
        templateId: templateId,
        title: { contains: 'Sample' }
      },
      include: {
        slides: {
          include: {
            elements: true
          },
          orderBy: { orderIndex: 'asc' }
        }
      }
    })
    
    if (!samplePres) {
      return res.status(404).json({ message: 'No sample presentation found for this template' })
    }
    
    // Create new presentation for current user
    const newPresentation = await prisma.presentation.create({
      data: {
        userId: req.userId,
        title: title || `My ${template.name}`,
        templateId: templateId
      }
    })
    
    // Copy all slides and elements
    for (const sampleSlide of samplePres.slides) {
      const newSlide = await prisma.slide.create({
        data: {
          presentationId: newPresentation.id,
          title: sampleSlide.title,
          content: sampleSlide.content,
          orderIndex: sampleSlide.orderIndex
        }
      })
      
      // Copy elements
      if (sampleSlide.elements && sampleSlide.elements.length > 0) {
        await prisma.element.createMany({
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
      }
    }
    
    // Return the new presentation with slides
    const fullPresentation = await prisma.presentation.findUnique({
      where: { id: newPresentation.id },
      include: {
        slides: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    })
    
    res.json(fullPresentation)
  } catch (error) {
    console.error('Error creating presentation from template:', error)
    res.status(500).json({ message: 'Failed to create presentation from template' })
  }
})

export default router
