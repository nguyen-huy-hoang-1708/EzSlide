import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth.js'

const prisma = new PrismaClient()
const router = Router()

router.use(authMiddleware)

// List presentations for current user with thumbnails and metadata
router.get('/', async (req, res) => {
  const list = await prisma.presentation.findMany({ 
    where: { userId: req.userId }, 
    orderBy: { updatedAt: 'desc' },
    include: { 
      slides: { 
        orderBy: { orderIndex: 'asc' },
        select: { id: true, title: true, content: true }
      } 
    }
  })
  
  // Add thumbnail (first slide's background) and slide count to each presentation
  const enrichedList = list.map(p => {
    let thumbnail = '#f3f4f6'
    
    if (p.slides[0]?.content) {
      try {
        const content = JSON.parse(p.slides[0].content)
        thumbnail = content.backgroundImage || content.background || '#f3f4f6'
      } catch (e) {
        // If parsing fails, use default
      }
    }
    
    return {
      id: p.id,
      title: p.title,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      userId: p.userId,
      slideCount: p.slides.length,
      thumbnail,
      firstSlideId: p.slides[0]?.id || null
    }
  })
  
  res.json(enrichedList)
})

router.post('/', async (req, res) => {
  const { title } = req.body
  if (!title) return res.status(400).json({ message: 'Missing title' })
  const p = await prisma.presentation.create({ data: { title, userId: req.userId } })
  res.json(p)
})

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const p = await prisma.presentation.findUnique({ where: { id }, include: { slides: true } })
  if (!p || p.userId !== req.userId) return res.status(404).json({ message: 'Not found' })
  res.json(p)
})

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { title } = req.body
  const p = await prisma.presentation.findUnique({ where: { id } })
  if (!p || p.userId !== req.userId) return res.status(404).json({ message: 'Not found' })
  const updated = await prisma.presentation.update({ where: { id }, data: { title } })
  res.json(updated)
})

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const p = await prisma.presentation.findUnique({ 
      where: { id },
      include: { slides: { include: { elements: true } } }
    })
    
    if (!p || p.userId !== req.userId) {
      return res.status(404).json({ message: 'Not found' })
    }
    
    // Cascade delete: elements -> slides -> presentation
    for (const slide of p.slides) {
      // Delete all elements of this slide
      await prisma.element.deleteMany({
        where: { slideId: slide.id }
      })
    }
    
    // Delete all slides
    await prisma.slide.deleteMany({
      where: { presentationId: id }
    })
    
    // Finally delete presentation
    await prisma.presentation.delete({ where: { id } })
    
    res.json({ ok: true })
  } catch (error) {
    console.error('Delete presentation error:', error)
    res.status(500).json({ message: 'Failed to delete presentation' })
  }
})

export default router
