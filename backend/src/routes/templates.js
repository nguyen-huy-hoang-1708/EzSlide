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

export default router
