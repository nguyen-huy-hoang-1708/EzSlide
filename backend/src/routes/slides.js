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

export default router
