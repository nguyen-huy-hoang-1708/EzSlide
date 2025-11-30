import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const prisma = new PrismaClient()
const router = Router()

const upload = multer({ dest: path.join(__dirname, '../../uploads') })

router.use(authMiddleware)

router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file
  if (!file) return res.status(400).json({ message: 'No file uploaded' })
  const url = `/uploads/${file.filename}`
  const asset = await prisma.asset.create({ data: { url, filename: file.originalname, userId: req.userId } })
  res.json(asset)
})

router.get('/', async (req, res) => {
  const assets = await prisma.asset.findMany({ where: { userId: req.userId } })
  res.json(assets)
})

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const a = await prisma.asset.findUnique({ where: { id } })
  if (!a) return res.status(404).json({ message: 'Not found' })
  if (a.userId !== req.userId) return res.status(403).json({ message: 'Not allowed' })
  try{
    const fs = await import('fs')
    const filename = a.url.split('/').pop()
    const filePath = path.join(__dirname, '../../uploads', filename)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  }catch(e){ console.warn('Could not delete file', e) }
  await prisma.asset.delete({ where: { id } })
  res.json({ ok: true })
})

export default router
