import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth.js'

const prisma = new PrismaClient()
const router = Router()

router.use(authMiddleware)

router.get('/', async (req, res) => {
  // find slides belonging to presentations owned by user
  const slides = await prisma.slide.findMany({ where: { presentation: { userId: req.userId } } })
  res.json(slides)
})

router.post('/', async (req, res) => {
  const { title, content, templateId, presentationId, orderIndex } = req.body
  if (!presentationId) return res.status(400).json({ message: 'presentationId required' })
  const p = await prisma.presentation.findUnique({ where: { id: presentationId } })
  if (!p || p.userId !== req.userId) return res.status(403).json({ message: 'Not allowed' })
  const slide = await prisma.slide.create({ data: { title, content: JSON.stringify(content || {}), presentationId, templateId, orderIndex } })
  res.json(slide)
})

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const slide = await prisma.slide.findUnique({ where: { id }, include: { presentation: true } })
  if (!slide || slide.presentation.userId !== req.userId) return res.status(404).json({ message: 'Not found' })
  res.json(slide)
})

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { title, content, orderIndex } = req.body
  const slide = await prisma.slide.findUnique({ where: { id }, include: { presentation: true } })
  if (!slide || slide.presentation.userId !== req.userId) return res.status(404).json({ message: 'Not found' })
  const updated = await prisma.slide.update({ where: { id }, data: { title, content: JSON.stringify(content), orderIndex } })
  res.json(updated)
})

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const slide = await prisma.slide.findUnique({ where: { id }, include: { presentation: true } })
  if (!slide || slide.presentation.userId !== req.userId) return res.status(404).json({ message: 'Not found' })
  await prisma.slide.delete({ where: { id } })
  res.json({ success: true })
})

router.get('/:id/export', async (req, res) => {
  const id = Number(req.params.id)
  const slide = await prisma.slide.findUnique({ where: { id }, include: { presentation: true } })
  if (!slide || slide.presentation.userId !== req.userId) return res.status(404).json({ message: 'Not found' })
  const format = req.query.format || 'pdf'
  let filename = `slide-${id}.${format}`
  let body
  let contentType = 'application/octet-stream'
  if (format === 'pptx'){
    contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    body = Buffer.from(`PPTX EXPORT FOR SLIDE ${id}\n\nTitle: ${slide.title}\nContent: ${slide.content}`)
  } else {
    contentType = 'application/pdf'
    body = Buffer.from(`PDF EXPORT FOR SLIDE ${id}\n\nTitle: ${slide.title}\nContent: ${slide.content}`)
  }
  res.setHeader('Content-Type', contentType)
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.send(body)
})

// Elements routes
router.get('/:id/elements', async (req, res) => {
  const slideId = Number(req.params.id)
  const slide = await prisma.slide.findUnique({ where: { id: slideId }, include: { presentation: true } })
  if (!slide || slide.presentation.userId !== req.userId) return res.status(404).json({ message: 'Not found' })
  const elements = await prisma.element.findMany({ where: { slideId }, orderBy: { zIndex: 'asc' } })
  res.json(elements)
})

router.post('/:id/elements', async (req, res) => {
  const slideId = Number(req.params.id)
  const slide = await prisma.slide.findUnique({ where: { id: slideId }, include: { presentation: true } })
  if (!slide || slide.presentation.userId !== req.userId) return res.status(404).json({ message: 'Not found' })
  const { type, x, y, width, height, zIndex, rotation, data } = req.body
  const element = await prisma.element.create({ 
    data: { 
      slideId, 
      type, 
      x: x || 0, 
      y: y || 0, 
      width: width || 100, 
      height: height || 100, 
      zIndex: zIndex || 0, 
      rotation: rotation || 0, 
      data: JSON.stringify(data || {}) 
    } 
  })
  res.json(element)
})

router.put('/:slideId/elements/:elementId', async (req, res) => {
  const slideId = Number(req.params.slideId)
  const elementId = Number(req.params.elementId)
  const slide = await prisma.slide.findUnique({ where: { id: slideId }, include: { presentation: true } })
  if (!slide || slide.presentation.userId !== req.userId) return res.status(404).json({ message: 'Not found' })
  
  const { type, x, y, width, height, zIndex, rotation, data } = req.body
  const element = await prisma.element.update({ 
    where: { id: elementId }, 
    data: { 
      type, 
      x, 
      y, 
      width, 
      height, 
      zIndex, 
      rotation, 
      data: typeof data === 'string' ? data : JSON.stringify(data) 
    } 
  })
  res.json(element)
})

router.delete('/:slideId/elements/:elementId', async (req, res) => {
  const slideId = Number(req.params.slideId)
  const elementId = Number(req.params.elementId)
  const slide = await prisma.slide.findUnique({ where: { id: slideId }, include: { presentation: true } })
  if (!slide || slide.presentation.userId !== req.userId) return res.status(404).json({ message: 'Not found' })
  
  await prisma.element.delete({ where: { id: elementId } })
  res.json({ success: true })
})

export default router
