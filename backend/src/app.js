import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import authRoutes from './routes/auth.js'
import slideRoutes from './routes/slides.js'
import templateRoutes from './routes/templates.js'
import assetRoutes from './routes/assets.js'
import aiRoutes from './routes/ai.js'
import presentationRoutes from './routes/presentations.js'
import userRoutes from './routes/users.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: '500mb' }))
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }))

app.use('/auth', authRoutes)
app.use('/slides', slideRoutes)
app.use('/templates', templateRoutes)
app.use('/assets', assetRoutes)
app.use('/ai', aiRoutes)
app.use('/presentations', presentationRoutes)
app.use('/users', userRoutes)

// Serve uploaded assets during development
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.get('/', (req, res) => res.send({ status: 'OK' }))

export default app
