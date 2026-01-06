import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth.js'
import PptxGenJS from 'pptxgenjs'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()
const router = Router()

router.use(authMiddleware)

// List presentations for current user with thumbnails and metadata
router.get('/', async (req, res) => {
  const list = await prisma.presentation.findMany({ 
    where: { userId: req.userId }, 
    orderBy: { updatedAt: 'desc' },
    include: { 
      slides: { 
        orderBy: { orderIndex: 'asc' },
        select: { id: true, title: true, content: true }
      } 
    }
  })
  
  // Add thumbnail (first slide's background) and slide count to each presentation
  const enrichedList = list.map(p => {
    let thumbnail = '#f3f4f6'
    
    if (p.slides[0]?.content) {
      try {
        const content = JSON.parse(p.slides[0].content)
        thumbnail = content.backgroundImage || content.background || '#f3f4f6'
      } catch (e) {
        // If parsing fails, use default
      }
    }
    
    return {
      id: p.id,
      title: p.title,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      userId: p.userId,
      slideCount: p.slides.length,
      thumbnail,
      firstSlideId: p.slides[0]?.id || null,
      slides: p.slides
    }
  })
  
  res.json(enrichedList)
})

router.post('/', async (req, res) => {
  const { title } = req.body
  if (!title) return res.status(400).json({ message: 'Missing title' })
  const p = await prisma.presentation.create({ data: { title, userId: req.userId } })
  res.json(p)
})

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const p = await prisma.presentation.findUnique({ 
    where: { id }, 
    include: { 
      slides: {
        include: {
          elements: true
        },
        orderBy: {
          orderIndex: 'asc'
        }
      }
    }
  })
  if (!p) {
    console.error(`Presentation ${id} not found in database`)
    return res.status(404).json({ message: 'Presentation not found' })
  }
  if (p.userId !== req.userId) {
    console.error(`Permission denied: presentation ${id} userId=${p.userId}, requested by userId=${req.userId}`)
    return res.status(404).json({ message: 'Not found' })
  }
  console.log(`✅ GET /presentations/${id} - ${p.slides.length} slides`)
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
  try {
    const id = Number(req.params.id)
    const p = await prisma.presentation.findUnique({ 
      where: { id },
      include: { slides: { include: { elements: true } } }
    })
    
    if (!p || p.userId !== req.userId) {
      return res.status(404).json({ message: 'Not found' })
    }
    
    // Cascade delete: elements -> slides -> presentation
    for (const slide of p.slides) {
      // Delete all elements of this slide
      await prisma.element.deleteMany({
        where: { slideId: slide.id }
      })
    }
    
    // Delete all slides
    await prisma.slide.deleteMany({
      where: { presentationId: id }
    })
    
    // Finally delete presentation
    await prisma.presentation.delete({ where: { id } })
    
    res.json({ ok: true })
  } catch (error) {
    console.error('Delete presentation error:', error)
    res.status(500).json({ message: 'Failed to delete presentation' })
  }
})

// Export presentation as PPTX
router.get('/:id/export', async (req, res) => {
  try {
    const id = Number(req.params.id)
    
    // Fetch presentation with all slides and elements
    const presentation = await prisma.presentation.findUnique({
      where: { id },
      include: {
        slides: {
          include: { elements: true },
          orderBy: { orderIndex: 'asc' }
        }
      }
    })
    
    if (!presentation || presentation.userId !== req.userId) {
      return res.status(404).json({ message: 'Presentation not found' })
    }
    
    // Create PPTX
    const pptx = new PptxGenJS()
    pptx.layout = 'LAYOUT_16x9'
    pptx.author = 'EzSlide'
    pptx.title = presentation.title
    
    // Convert each slide
    for (const slideData of presentation.slides) {
      const slide = pptx.addSlide()
      
      // Parse slide content for background
      let content = {}
      try {
        content = JSON.parse(slideData.content || '{}')
      } catch (e) {
        console.error('Failed to parse slide content')
      }
      
      // Set background
      if (content.backgroundImage) {
        // If it's a URL, try to use it (may not work for external URLs)
        if (content.backgroundImage.startsWith('http')) {
          slide.background = { data: content.backgroundImage }
        }
      } else if (content.background) {
        // Solid color background
        const color = content.background.replace('#', '')
        slide.background = { color }
      } else {
        slide.background = { color: 'FFFFFF' }
      }
      
      // Add elements
      for (const elem of slideData.elements) {
        let elemData = elem.data
        if (typeof elemData === 'string') {
          try {
            elemData = JSON.parse(elemData)
          } catch (e) {
            console.error('Failed to parse element data')
            continue
          }
        }
        
        // Convert pixels to inches (assuming 960x540 canvas = 10x5.625 inches)
        const xInches = (elem.x / 960) * 10
        const yInches = (elem.y / 540) * 5.625
        const wInches = (elem.width / 960) * 10
        const hInches = (elem.height / 540) * 5.625
        
        if (elem.type === 'text') {
          slide.addText(elemData.text || '', {
            x: xInches,
            y: yInches,
            w: wInches,
            h: hInches,
            fontSize: elemData.fontSize || 16,
            color: (elemData.color || '#000000').replace('#', ''),
            bold: elemData.fontWeight === 'bold',
            italic: elemData.fontStyle === 'italic',
            align: elemData.textAlign || 'left',
            fontFace: elemData.fontFamily || 'Arial',
            rotate: elem.rotation || 0
          })
        } else if (elem.type === 'image' && elemData.src) {
          // Only works for local files in uploads folder
          if (elemData.src.startsWith('/uploads/')) {
            const imagePath = path.join(__dirname, '../..', elemData.src)
            if (fs.existsSync(imagePath)) {
              slide.addImage({
                path: imagePath,
                x: xInches,
                y: yInches,
                w: wInches,
                h: hInches,
                rotate: elem.rotation || 0
              })
            }
          }
        } else if (elem.type === 'shape') {
          const shapeType = elemData.shapeType || 'rect'
          let pptxShape = pptx.ShapeType.rect
          
          if (shapeType === 'circle') pptxShape = pptx.ShapeType.ellipse
          else if (shapeType === 'triangle') pptxShape = pptx.ShapeType.triangle
          else if (shapeType === 'star') pptxShape = pptx.ShapeType.star5
          
          slide.addShape(pptxShape, {
            x: xInches,
            y: yInches,
            w: wInches,
            h: hInches,
            fill: { color: (elemData.fill || '#000000').replace('#', '') },
            line: elemData.stroke ? {
              color: elemData.stroke.replace('#', ''),
              width: elemData.strokeWidth || 1
            } : { type: 'none' },
            rotate: elem.rotation || 0
          })
        }
      }
    }
    
    // Save to temp file
    const outputDir = path.join(__dirname, '../../uploads/presentations')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    const filename = `${presentation.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pptx`
    const filepath = path.join(outputDir, filename)
    
    await pptx.writeFile({ fileName: filepath })
    
    // Send file
    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Download error:', err)
      }
      // Delete temp file after download
      setTimeout(() => {
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath)
        }
      }, 60000) // Delete after 1 minute
    })
    
  } catch (error) {
    console.error('Export error:', error)
    res.status(500).json({ message: 'Failed to export presentation' })
  }
})

export default router
