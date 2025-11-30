import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth.js'

const prisma = new PrismaClient()
const router = Router()

router.post('/generate', authMiddleware, async (req, res) => {
  const { prompt, count = 3, tone = 'neutral' } = req.body
  const slides = Array.from({ length: count }).map((_, i) => ({ title: `${prompt} - Slide ${i + 1}`, content: JSON.stringify({ text: `Generated content (${tone}): ${prompt} — slide ${i + 1}` }) }))
  const created = []
  for (const s of slides) {
    created.push(await prisma.slide.create({ data: { title: s.title, content: s.content, userId: req.userId } }))
  }
  res.json({ slides: created })
})

export default router
