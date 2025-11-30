import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth.js'

const prisma = new PrismaClient()
const router = Router()

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body
  if (!email || !password || !name) return res.status(400).json({ message: 'Missing inputs' })
  // Email format
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ message: 'メールアドレスの形式が不正です' })
  // Username length
  if (name.length > 32) return res.status(400).json({ message: 'ユーザー名は32文字以内で入力してください' })
  // Password complexity: at least two groups among letters, numbers, symbols (no quotes allowed)
  if (/["']/.test(password)) return res.status(400).json({ message: 'パスワードに使用できない文字が含まれています' })
  const groups = [(/[A-Za-z]/.test(password)), (/[0-9]/.test(password)), (/[^A-Za-z0-9]/.test(password))].filter(Boolean).length
  if (groups < 2) return res.status(400).json({ message: 'パスワードは英字、数字、記号のうち2種類以上を含めてください' })
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(400).json({ message: 'メールアドレスは既に使用されています' })
  const existingName = await prisma.user.findFirst({ where: { name } })
  if (existingName) return res.status(400).json({ message: 'ユーザー名は既に存在します' })
  const hashed = await bcrypt.hash(password, 10)
  // force role to user for registration
  const user = await prisma.user.create({ data: { email, password: hashed, name, role: 'user' } })
  res.json({ id: user.id, email: user.email, name: user.name })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Missing inputs' })
  // Simple checks
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(401).json({ message: 'メールアドレスまたはパスワードが誤っています' })
  if (/["']/.test(password)) return res.status(401).json({ message: 'メールアドレスまたはパスワードが誤っています' })
  const groups = [(/[A-Za-z]/.test(password)), (/[0-9]/.test(password)), (/[^A-Za-z0-9]/.test(password))].filter(Boolean).length
  if (groups < 2) return res.status(401).json({ message: 'メールアドレスまたはパスワードが誤っています' })
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ message: 'メールアドレスまたはパスワードが誤っています' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ message: 'メールアドレスまたはパスワードが誤っています' })
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'change-me', { expiresIn: '7d' })
  const home = user.role === 'admin' ? '/admin' : '/dashboard'
  res.json({ token, homeUrl: home, role: user.role })
})

router.post('/reset-password', async (req, res) => {
  const { email } = req.body
  res.json({ message: `Password reset link sent to ${email} (placeholder)` })
})

router.get('/me', authMiddleware, async (req, res) => {
  const userId = req.userId
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true, avatarUrl: true, role: true } })
  res.json({ user })
})

router.put('/me', authMiddleware, async (req, res) => {
  const userId = req.userId
  const { name, email, currentPassword, password } = req.body
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return res.status(404).json({ message: 'User not found' })
  if (email && email !== user.email) {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ message: 'Email already taken' })
  }
  const data = {}
  if (name) data.name = name
  if (email) data.email = email
  if (password) {
    if (!currentPassword) return res.status(400).json({ message: 'Current password required' })
    const ok = await bcrypt.compare(currentPassword, user.password)
    if (!ok) return res.status(401).json({ message: 'Current password incorrect' })
    data.password = await bcrypt.hash(password, 10)
  }
  const updated = await prisma.user.update({ where: { id: userId }, data })
  res.json({ user: { id: updated.id, email: updated.email, name: updated.name, avatarUrl: updated.avatarUrl } })
})

export default router
