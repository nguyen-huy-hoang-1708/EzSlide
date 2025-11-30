import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth.js'
import { adminOnly } from '../middleware/role.js'

const prisma = new PrismaClient()
const router = Router()

router.use(authMiddleware)
router.use(adminOnly)

router.get('/', async (req, res) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(users)
})

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { role } = req.body
  if (!role) return res.status(400).json({ message: 'role required' })
  const updated = await prisma.user.update({ where: { id }, data: { role } })
  res.json(updated)
})

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id)
  // prevent admin from deleting themselves
  if (req.userId === id) return res.status(400).json({ message: 'Cannot delete yourself' })
  await prisma.user.delete({ where: { id } })
  res.json({ ok: true })
})

export default router
