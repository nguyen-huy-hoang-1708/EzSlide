import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth.js'

const prisma = new PrismaClient()
const router = Router()

router.use(authMiddleware)

// List presentations for current user
router.get('/', async (req, res) => {
  const list = await prisma.presentation.findMany({ where: { userId: req.userId }, orderBy: { updatedAt: 'desc' } })
  res.json(list)
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
  const id = Number(req.params.id)
  const p = await prisma.presentation.findUnique({ where: { id } })
  if (!p || p.userId !== req.userId) return res.status(404).json({ message: 'Not found' })
  await prisma.presentation.delete({ where: { id } })
  res.json({ ok: true })
})

export default router
