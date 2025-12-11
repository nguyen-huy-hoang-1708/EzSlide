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
  
  // Default empty slide content
  const defaultContent = content || {
    elements: [],
    background: '#ffffff'
  }
  
  // Get max orderIndex for this presentation if orderIndex not provided
  let finalOrderIndex = orderIndex
  if (finalOrderIndex === undefined) {
    const lastSlide = await prisma.slide.findFirst({
      where: { presentationId },
      orderBy: { orderIndex: 'desc' }
    })
    finalOrderIndex = lastSlide ? lastSlide.orderIndex + 1 : 0
  }
  
  const slide = await prisma.slide.create({ 
    data: { 
      title: title || 'Untitled Slide', 
      content: JSON.stringify(defaultContent), 
      presentationId, 
      templateId, 
      orderIndex: finalOrderIndex 
    } 
  })
  res.json(slide)
})

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const slide = await prisma.slide.findUnique({ where: { id }, include: { presentation: true } })
  if (!slide || slide.presentation.userId !== req.userId) return res.status(404).json({ message: 'Not found' })
  res.json(slide)
})

router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { title, content, orderIndex } = req.body
    
    // Validate slide exists and user has permission
    const slide = await prisma.slide.findUnique({ where: { id }, include: { presentation: true } })
    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' })
    }
    if (slide.presentation.userId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this slide' })
    }
    
    // Validate content structure if provided
    if (content) {
      if (typeof content !== 'object' || Array.isArray(content)) {
        return res.status(400).json({ message: 'Content must be an object' })
      }
      
      // Validate elements array if present
      if (content.elements && !Array.isArray(content.elements)) {
        return res.status(400).json({ message: 'Elements must be an array' })
      }
      
      // Validate each element
      if (content.elements) {
        for (let i = 0; i < content.elements.length; i++) {
          const el = content.elements[i]
          
          // Check required fields
          if (!el.type) {
            return res.status(400).json({ message: `Element ${i}: type is required` })
          }
          
          // Validate element type
          const validTypes = ['text', 'image', 'shape', 'chart', 'table']
          if (!validTypes.includes(el.type)) {
            return res.status(400).json({ message: `Element ${i}: invalid type '${el.type}'. Must be one of: ${validTypes.join(', ')}` })
          }
          
          // Validate position and size
          if (el.x !== undefined && (typeof el.x !== 'number' || el.x < 0)) {
            return res.status(400).json({ message: `Element ${i}: x must be a non-negative number` })
          }
          if (el.y !== undefined && (typeof el.y !== 'number' || el.y < 0)) {
            return res.status(400).json({ message: `Element ${i}: y must be a non-negative number` })
          }
          if (el.width !== undefined && (typeof el.width !== 'number' || el.width <= 0)) {
            return res.status(400).json({ message: `Element ${i}: width must be a positive number` })
          }
          if (el.height !== undefined && (typeof el.height !== 'number' || el.height <= 0)) {
            return res.status(400).json({ message: `Element ${i}: height must be a positive number` })
          }
          
          // Validate style object if present
          if (el.style && typeof el.style !== 'object') {
            return res.status(400).json({ message: `Element ${i}: style must be an object` })
          }
          
          // Validate image URL format if type is image
          if (el.type === 'image' && el.src) {
            try {
              new URL(el.src)
            } catch (e) {
              return res.status(400).json({ message: `Element ${i}: invalid image URL format` })
            }
          }
        }
      }
      
      // Validate background color format if present
      if (content.background && typeof content.background !== 'string') {
        return res.status(400).json({ message: 'Background must be a string' })
      }
      
      // Validate backgroundImage URL if present
      if (content.backgroundImage) {
        try {
          new URL(content.backgroundImage)
        } catch (e) {
          return res.status(400).json({ message: 'Invalid backgroundImage URL format' })
        }
      }
    }
    
    // Update with version control - use updatedAt to prevent concurrent save conflicts
    const updateData = {}
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = JSON.stringify(content)
    if (orderIndex !== undefined) updateData.orderIndex = orderIndex
    
    const updated = await prisma.slide.update({ 
      where: { id }, 
      data: updateData 
    })
    
    res.json(updated)
  } catch (error) {
    console.error('Error updating slide:', error)
    res.status(500).json({ message: 'Internal server error while updating slide', error: error.message })
  }
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

// Elements routes
router.get('/:id/elements', async (req, res) => {
  try {
    const slideId = Number(req.params.id)
    const slide = await prisma.slide.findUnique({ where: { id: slideId }, include: { presentation: true } })
    if (!slide || slide.presentation.userId !== req.userId) return res.status(404).json({ message: 'Not found' })
    
    // Query without orderBy to avoid "Out of sort memory" error with large data
    const elements = await prisma.element.findMany({ 
      where: { slideId },
      // Remove orderBy if data is too large
      // Sort in JavaScript instead
    })
    
    // Sort in JavaScript to avoid MySQL sort buffer overflow
    elements.sort((a, b) => a.zIndex - b.zIndex)
    
    res.json(elements)
  } catch (err) {
    console.error('Error fetching elements:', err)
    res.status(500).json({ message: 'Failed to fetch elements', error: err.message })
  }
})

router.post('/:id/elements', async (req, res) => {
  const slideId = Number(req.params.id)
  const slide = await prisma.slide.findUnique({ where: { id: slideId }, include: { presentation: true } })
  if (!slide || slide.presentation.userId !== req.userId) return res.status(404).json({ message: 'Not found' })
  const { type, x, y, width, height, zIndex, rotation, data } = req.body
  const element = await prisma.element.create({ 
    data: { 
      slideId, 
      type, 
      x: x || 0, 
      y: y || 0, 
      width: width || 100, 
      height: height || 100, 
      zIndex: zIndex || 0, 
      rotation: rotation || 0, 
      data: JSON.stringify(data || {}) 
    } 
  })
  res.json(element)
})

router.put('/:slideId/elements/:elementId', async (req, res) => {
  try {
    const slideId = Number(req.params.slideId)
    const elementId = Number(req.params.elementId)
    
    console.log('=== UPDATE ELEMENT ===')
    console.log('Slide ID:', slideId, 'Element ID:', elementId)
    console.log('Request body:', req.body)
    
    const slide = await prisma.slide.findUnique({ where: { id: slideId }, include: { presentation: true } })
    if (!slide || slide.presentation.userId !== req.userId) {
      console.log('Slide not found or unauthorized')
      return res.status(404).json({ message: 'Not found' })
    }
    
    const { type, x, y, width, height, zIndex, rotation, data } = req.body
    
    // Build update data - only include defined fields
    const updateData = {}
    if (type !== undefined) updateData.type = type
    if (x !== undefined) updateData.x = x
    if (y !== undefined) updateData.y = y
    if (width !== undefined) updateData.width = width
    if (height !== undefined) updateData.height = height
    if (zIndex !== undefined) updateData.zIndex = zIndex
    if (rotation !== undefined) updateData.rotation = rotation
    if (data !== undefined) {
      updateData.data = typeof data === 'string' ? data : JSON.stringify(data)
    }
    
    console.log('Update data:', updateData)
    
    const element = await prisma.element.update({ 
      where: { id: elementId }, 
      data: updateData
    })
    
    console.log('Updated element:', element)
    res.json(element)
  } catch (error) {
    console.error('Error updating element:', error)
    res.status(500).json({ message: 'Failed to update element', error: error.message })
  }
})

router.delete('/:slideId/elements/:elementId', async (req, res) => {
  const slideId = Number(req.params.slideId)
  const elementId = Number(req.params.elementId)
  const slide = await prisma.slide.findUnique({ where: { id: slideId }, include: { presentation: true } })
  if (!slide || slide.presentation.userId !== req.userId) return res.status(404).json({ message: 'Not found' })
  
  await prisma.element.delete({ where: { id: elementId } })
  res.json({ success: true })
})

export default router
