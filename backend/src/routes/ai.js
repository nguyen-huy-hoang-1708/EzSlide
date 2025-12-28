import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth.js'
import ollamaService from '../services/ollamaService.js'
import pptxService from '../services/pptxService.js'

const prisma = new PrismaClient()
const router = Router()

/**
 * POST /ai/generate
 * Legacy endpoint - giữ nguyên để backward compatible
 */
router.post('/generate', authMiddleware, async (req, res) => {
  const { prompt, count = 3, tone = 'neutral' } = req.body
  const slides = Array.from({ length: count }).map((_, i) => ({ 
    title: `${prompt} - Slide ${i + 1}`, 
    content: JSON.stringify({ text: `Generated content (${tone}): ${prompt} — slide ${i + 1}` }) 
  }))
  const created = []
  for (const s of slides) {
    created.push(await prisma.slide.create({ 
      data: { 
        title: s.title, 
        content: s.content, 
        userId: req.userId 
      } 
    }))
  }
  res.json({ slides: created })
})

/**
 * POST /ai/generate-slides
 * Endpoint mới: Tạo slides bằng AI local (Ollama) và export ra PPTX
 * Body params:
 * - topic: chủ đề presentation (required)
 * - slideCount: số lượng slide (default: 5)
 * - tone: formal|casual|professional|creative (default: professional)
 * - language: vi|en (default: vi)
 * - includeImages: boolean (default: false)
 * - exportFormat: json|pptx (default: pptx)
 */
router.post('/generate-slides', authMiddleware, async (req, res) => {
  try {
    const {
      topic,
      slideCount = 5,
      tone = 'professional',
      language = 'vi',
      includeImages = false,
      exportFormat = 'pptx'
    } = req.body

    // Validate
    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Topic is required' 
      })
    }

    if (slideCount < 2 || slideCount > 20) {
      return res.status(400).json({ 
        error: 'Slide count must be between 2 and 20' 
      })
    }

    // Bước 1: Gọi Ollama AI để generate slide plan
    console.log(`Generating slides for topic: ${topic}`)
    const slidePlans = await ollamaService.generateSlidePlan({
      topic,
      slideCount,
      tone,
      language,
      includeImages
    })

    if (!slidePlans || slidePlans.length === 0) {
      return res.status(500).json({ 
        error: 'AI failed to generate slides' 
      })
    }

    // Nếu chỉ cần JSON, trả về luôn
    if (exportFormat === 'json') {
      return res.json({
        success: true,
        slides: slidePlans,
        metadata: {
          topic,
          slideCount: slidePlans.length,
          tone,
          language,
          generatedAt: new Date().toISOString()
        }
      })
    }

    // Bước 2: Dùng PptxGenJS tạo file PowerPoint
    console.log('Generating PowerPoint file...')
    const pptxResult = await pptxService.generatePresentation(slidePlans, {
      title: topic,
      author: req.user?.username || 'Anonymous'
    })

    // Bước 3: Lưu thông tin vào database (optional - có thể lưu vào presentations)
    // TODO: Tích hợp với bảng presentations nếu cần

    // Trả về kết quả
    res.json({
      success: true,
      slides: slidePlans,
      file: {
        filename: pptxResult.filename,
        downloadUrl: pptxResult.url,
        filepath: pptxResult.filepath
      },
      metadata: {
        topic,
        slideCount: slidePlans.length,
        tone,
        language,
        generatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error in /ai/generate-slides:', error)
    res.status(500).json({ 
      error: 'Failed to generate slides',
      message: error.message 
    })
  }
})

/**
 * GET /ai/health
 * Kiểm tra trạng thái của Ollama service
 */
router.get('/health', async (req, res) => {
  try {
    const health = await ollamaService.healthCheck()
    res.json(health)
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      error: error.message 
    })
  }
})

/**
 * POST /ai/pull-model
 * Pull một model về máy (admin only)
 */
router.post('/pull-model', authMiddleware, async (req, res) => {
  try {
    const { modelName } = req.body
    
    if (!modelName) {
      return res.status(400).json({ error: 'modelName is required' })
    }

    const result = await ollamaService.pullModel(modelName)
    res.json(result)
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to pull model',
      message: error.message 
    })
  }
})

export default router
