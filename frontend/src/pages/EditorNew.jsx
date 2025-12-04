import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import PresentationMode from '../components/PresentationMode'

export default function Editor(){
  const { id } = useParams() // This is slideId
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  
  // Presentation & Slides
  const [presentation, setPresentation] = useState(null)
  const [allSlides, setAllSlides] = useState([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  
  // Current slide data
  const [slide, setSlide] = useState(null)
  const [elements, setElements] = useState([])
  const [selectedElement, setSelectedElement] = useState(null)
  
  // Slide properties
  const [background, setBackground] = useState('#ffffff')
  const [backgroundImage, setBackgroundImage] = useState('')
  
  // Tool state
  const [activeTool, setActiveTool] = useState(null) // 'text', 'image', 'shape'
  const [saving, setSaving] = useState(false)
  
  // Presentation mode
  const [isPresentationMode, setIsPresentationMode] = useState(false)
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [elementStart, setElementStart] = useState({ x: 0, y: 0 })
  const [selectedElementIndex, setSelectedElementIndex] = useState(null)

  useEffect(() => {
    loadSlide()
  }, [id])

  async function loadSlide() {
    if (id === 'new') {
      try {
        const res = await api.post('/slides', { 
          title: 'Untitled Slide', 
          content: JSON.stringify({ background: '#ffffff' }),
          presentationId: 1 // TODO: get from context
        })
        navigate(`/editor/${res.data.id}`, { replace: true })
      } catch (err) {
        console.error('Failed to create slide:', err)
      }
      return
    }

    try {
      // 1. Load the current slide
      const slideRes = await api.get(`/slides/${id}`)
      const currentSlide = slideRes.data
      setSlide(currentSlide)
      
      // Parse content
      try {
        const content = JSON.parse(currentSlide.content)
        setBackground(content.background || '#ffffff')
        setBackgroundImage(content.backgroundImage || '')
      } catch (e) {
        console.error('Failed to parse slide content')
      }

      // 2. Load elements for current slide
      const elemRes = await api.get(`/slides/${id}/elements`)
      const loadedElements = (elemRes.data || []).map(elem => ({
        ...elem,
        data: typeof elem.data === 'string' ? JSON.parse(elem.data) : elem.data
      }))
      setElements(loadedElements)
      
      // 3. Load the presentation to get all slides
      if (currentSlide.presentationId) {
        const presRes = await api.get(`/presentations/${currentSlide.presentationId}`)
        setPresentation(presRes.data)
        
        // Check if this is a template sample - warn user
        if (presRes.data.title?.includes('Sample')) {
          const shouldCopy = window.confirm(
            '⚠️ You are editing a template sample!\n\n' +
            'Changes will affect the template for all users.\n\n' +
            'Click OK to create your own copy, or Cancel to edit the template directly.'
          )
          
          if (shouldCopy) {
            // Use template to create new presentation
            const useRes = await api.post(`/templates/${presRes.data.templateId}/use`, {
              title: presRes.data.title.replace(' - Sample', '')
            })
            
            // Navigate to the new presentation's first slide
            if (useRes.data.slides?.[0]?.id) {
              navigate(`/editor/${useRes.data.slides[0].id}`, { replace: true })
              return // Stop current load
            }
          }
        }
        
        // Sort slides by orderIndex
        const slides = (presRes.data.slides || []).sort((a, b) => a.orderIndex - b.orderIndex)
        setAllSlides(slides)
        
        // Find current slide index
        const idx = slides.findIndex(s => s.id === currentSlide.id)
        setCurrentSlideIndex(idx >= 0 ? idx : 0)
      }
    } catch (err) {
      console.error('Failed to load slide:', err)
    }
  }
  
  function switchToSlide(slideId) {
    navigate(`/editor/${slideId}`)
  }

  async function saveSlide() {
    if (!slide) return
    
    console.log('=== SAVE DEBUG ===')
    console.log('Slide ID:', slide.id)
    console.log('Presentation:', presentation)
    console.log('Elements to save:', elements)
    
    setSaving(true)
    try {
      // Send content as object, not string (backend will stringify it)
      const contentObj = { 
        background, 
        backgroundImage,
        elements: [] // Backend handles elements separately
      }
      
      console.log('Saving slide content...', contentObj)
      await api.put(`/slides/${slide.id}`, { 
        title: slide.title,
        content: contentObj  // Send as object
      })
      console.log('✅ Slide content saved')
      
      // Get current elements in database
      console.log('Fetching current elements from DB...')
      const currentElemsRes = await api.get(`/slides/${slide.id}/elements`)
      const currentElems = currentElemsRes.data || []
      console.log('Current elements in DB:', currentElems)
      
      // Find elements to delete (in DB but not in current state)
      const currentElemIds = elements.map(e => e.id).filter(Boolean)
      const toDelete = currentElems.filter(e => !currentElemIds.includes(e.id))
      
      console.log('Elements to delete:', toDelete.length)
      
      // Delete removed elements
      for (const elem of toDelete) {
        console.log('Deleting element:', elem.id)
        await api.delete(`/slides/${slide.id}/elements/${elem.id}`)
      }
      
      console.log('Saving/updating', elements.length, 'elements...')
      
      // Save/update all current elements
      for (const elem of elements) {
        if (elem.id) {
          // Update existing element
          console.log('Updating element:', elem.id, elem)
          const updatePayload = {
            type: elem.type,
            x: elem.x,
            y: elem.y,
            width: elem.width,
            height: elem.height,
            zIndex: elem.zIndex || 0,
            rotation: elem.rotation || 0,
            data: elem.data
          }
          console.log('Update payload:', updatePayload)
          await api.put(`/slides/${slide.id}/elements/${elem.id}`, updatePayload)
        } else {
          // Create new element
          console.log('Creating new element:', elem.type, elem)
          const createPayload = {
            type: elem.type,
            x: elem.x,
            y: elem.y,
            width: elem.width,
            height: elem.height,
            zIndex: elem.zIndex || 0,
            rotation: elem.rotation || 0,
            data: elem.data
          }
          console.log('Create payload:', createPayload)
          const res = await api.post(`/slides/${slide.id}/elements`, createPayload)
          elem.id = res.data.id
          console.log('Created with ID:', elem.id)
        }
      }
      
      console.log('Reloading elements from DB...')
      // Reload elements from database to ensure sync
      const elemRes = await api.get(`/slides/${slide.id}/elements`)
      const reloadedElements = (elemRes.data || []).map(elem => ({
        ...elem,
        data: typeof elem.data === 'string' ? JSON.parse(elem.data) : elem.data
      }))
      setElements(reloadedElements)
      console.log('Reloaded', reloadedElements.length, 'elements')
      
      // Update allSlides thumbnail for sidebar
      const updatedSlides = [...allSlides]
      const currentIdx = updatedSlides.findIndex(s => s.id === slide.id)
      if (currentIdx >= 0) {
        updatedSlides[currentIdx] = {
          ...updatedSlides[currentIdx],
          content: JSON.stringify(contentObj)
        }
        setAllSlides(updatedSlides)
      }
      
      alert('✅ Slide saved successfully!')
    } catch (err) {
      console.error('Save failed:', err)
      alert('❌ Failed to save slide: ' + (err.response?.data?.message || err.message))
    }
    setSaving(false)
  }

  // Export presentation as JSON
  function exportPresentation() {
    if (!presentation || !allSlides.length) {
      alert('No presentation to export')
      return
    }

    const exportData = {
      presentation: {
        title: presentation.title,
        createdAt: presentation.createdAt,
        updatedAt: presentation.updatedAt
      },
      slides: allSlides.map(s => {
        let content = {}
        try {
          content = JSON.parse(s.content || '{}')
        } catch (e) {
          console.error('Failed to parse slide content')
        }
        return {
          title: s.title,
          orderIndex: s.orderIndex,
          content,
          // Note: elements would need to be fetched separately if needed
        }
      })
    }

    // Create download link
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${presentation.title || 'presentation'}_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    alert('✅ Presentation exported successfully!')
  }

  function addTextElement() {
    const newElement = {
      type: 'text',
      x: 100,
      y: 100,
      width: 300,
      height: 100,
      zIndex: elements.length,
      rotation: 0,
      data: {
        text: 'Double click to edit',
        fontSize: 24,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        textAlign: 'left'
      }
    }
    setElements([...elements, newElement])
    setSelectedElement(newElement)
    setSelectedElementIndex(elements.length)
  }

  function addImageElement() {
    const url = prompt('Enter image URL:')
    if (!url) return
    
    const newElement = {
      type: 'image',
      x: 100,
      y: 100,
      width: 400,
      height: 300,
      zIndex: elements.length,
      rotation: 0,
      data: {
        imageUrl: url,
        alt: 'Image'
      }
    }
    setElements([...elements, newElement])
    setSelectedElement(newElement)
    setSelectedElementIndex(elements.length)
  }

  function addShapeElement(shapeType) {
    const newElement = {
      type: 'shape',
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      zIndex: elements.length,
      rotation: 0,
      data: {
        shape: shapeType,
        fill: '#3b82f6',
        stroke: '#1e40af',
        strokeWidth: 2,
        opacity: 1
      }
    }
    setElements([...elements, newElement])
    setSelectedElement(newElement)
    setSelectedElementIndex(elements.length)
  }

  function updateSelectedElement(updates) {
    if (selectedElementIndex === null) return
    
    setElements(prev => {
      const updated = [...prev]
      updated[selectedElementIndex] = {
        ...updated[selectedElementIndex],
        ...updates
      }
      return updated
    })
    
    setSelectedElement(prev => ({ ...prev, ...updates }))
  }

  function updateSelectedElementData(dataUpdates) {
    if (selectedElementIndex === null) return
    
    setElements(prev => {
      const updated = [...prev]
      updated[selectedElementIndex] = {
        ...updated[selectedElementIndex],
        data: {
          ...updated[selectedElementIndex].data,
          ...dataUpdates
        }
      }
      return updated
    })
    
    setSelectedElement(prev => ({
      ...prev,
      data: { ...prev.data, ...dataUpdates }
    }))
  }

  function deleteSelectedElement() {
    if (selectedElementIndex === null) return
    setElements(elements.filter((_, idx) => idx !== selectedElementIndex))
    setSelectedElement(null)
    setSelectedElementIndex(null)
  }

  function moveElement(direction) {
    if (!selectedElement) return
    const step = 10
    const updates = {
      x: selectedElement.x + (direction === 'left' ? -step : direction === 'right' ? step : 0),
      y: selectedElement.y + (direction === 'up' ? -step : direction === 'down' ? step : 0)
    }
    updateSelectedElement(updates)
  }
  
  // Drag handlers
  function handleMouseDown(e, elem, idx) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    setSelectedElement(elem)
    setSelectedElementIndex(idx)
    setDragStart({ x: e.clientX, y: e.clientY })
    setElementStart({ x: elem.x, y: elem.y })
  }
  
  function handleMouseMove(e) {
    if (!isDragging || selectedElementIndex === null) return
    
    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y
    
    const newX = elementStart.x + deltaX
    const newY = elementStart.y + deltaY
    
    // Update element at specific index
    setElements(prev => {
      const updated = [...prev]
      updated[selectedElementIndex] = {
        ...updated[selectedElementIndex],
        x: newX,
        y: newY
      }
      return updated
    })
    
    // Update selected element
    setSelectedElement(prev => ({
      ...prev,
      x: newX,
      y: newY
    }))
  }
  
  function handleMouseUp() {
    if (isDragging) {
      setIsDragging(false)
    }
  }
  
  // Save element changes immediately
  async function saveCurrentElement() {
    if (!selectedElement || !slide) return
    setSaving(true)
    try {
      if (selectedElement.id) {
        await api.put(`/slides/${slide.id}/elements/${selectedElement.id}`, selectedElement)
      } else {
        const res = await api.post(`/slides/${slide.id}/elements`, selectedElement)
        // Update element with new ID
        setElements(elements.map(elem => 
          elem === selectedElement ? { ...selectedElement, id: res.data.id } : elem
        ))
        setSelectedElement({ ...selectedElement, id: res.data.id })
      }
      alert('Element saved successfully!')
    } catch (err) {
      console.error('Failed to save element:', err)
      alert('Failed to save element')
    }
    setSaving(false)
  }

  // Add icon element
  function addIconElement() {
    const icons = ['😀', '😍', '🎉', '⭐', '❤️', '👍', '🔥', '💡', '✅', '❌', '➡️', '⬅️', '⬆️', '⬇️', '🏠', '📧', '📱', '💼', '🎯', '🚀']
    const icon = prompt(`Enter emoji or choose from:\n${icons.join(' ')}`)
    if (!icon) return
    
    const newElement = {
      type: 'text',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      zIndex: elements.length,
      rotation: 0,
      data: {
        text: icon,
        fontSize: 64,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        textAlign: 'center'
      }
    }
    setElements([...elements, newElement])
    setSelectedElement(newElement)
    setSelectedElementIndex(elements.length)
  }

  // Delete current slide
  async function deleteCurrentSlide() {
    if (!slide || allSlides.length <= 1) {
      alert('Cannot delete the last slide')
      return
    }
    
    if (!confirm(`Delete slide "${slide.title}"?`)) return
    
    try {
      await api.delete(`/slides/${slide.id}`)
      // Navigate to previous or next slide
      const nextSlide = allSlides[currentSlideIndex + 1] || allSlides[currentSlideIndex - 1]
      if (nextSlide) {
        navigate(`/editor/${nextSlide.id}`)
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      console.error('Failed to delete slide:', err)
      alert('Failed to delete slide')
    }
  }

  // Duplicate current slide
  async function duplicateSlide() {
    if (!slide) return
    
    try {
      const content = JSON.stringify({ background, backgroundImage })
      const res = await api.post('/slides', {
        title: `${slide.title} (Copy)`,
        content,
        presentationId: slide.presentationId,
        orderIndex: slide.orderIndex + 1
      })
      
      // Copy elements
      for (const elem of elements) {
        await api.post(`/slides/${res.data.id}/elements`, {
          type: elem.type,
          x: elem.x,
          y: elem.y,
          width: elem.width,
          height: elem.height,
          zIndex: elem.zIndex,
          rotation: elem.rotation,
          data: elem.data
        })
      }
      
      navigate(`/editor/${res.data.id}`)
    } catch (err) {
      console.error('Failed to duplicate slide:', err)
      alert('Failed to duplicate slide')
    }
  }

  // Add new blank slide
  async function addNewSlide() {
    if (!presentation) return
    
    try {
      const res = await api.post('/slides', {
        title: 'New Slide',
        content: JSON.stringify({ background: '#ffffff' }),
        presentationId: presentation.id,
        orderIndex: allSlides.length
      })
      navigate(`/editor/${res.data.id}`)
    } catch (err) {
      console.error('Failed to add slide:', err)
      alert('Failed to add slide')
    }
  }

  // Move slide up/down in order
  async function moveSlide(direction) {
    if (!slide) return
    
    const targetIndex = direction === 'up' ? currentSlideIndex - 1 : currentSlideIndex + 1
    if (targetIndex < 0 || targetIndex >= allSlides.length) return
    
    const targetSlide = allSlides[targetIndex]
    
    try {
      // Swap order indices
      await api.put(`/slides/${slide.id}`, { orderIndex: targetSlide.orderIndex })
      await api.put(`/slides/${targetSlide.id}`, { orderIndex: slide.orderIndex })
      
      // Reload
      loadSlide()
    } catch (err) {
      console.error('Failed to move slide:', err)
      alert('Failed to move slide')
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Toolbar */}
      <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-gray-900">
            ← Back
          </button>
          <input 
            type="text" 
            value={slide?.title || ''} 
            onChange={(e) => setSlide({...slide, title: e.target.value})}
            className="text-lg font-semibold border-b border-transparent hover:border-gray-300 focus:border-indigo-500 outline-none px-2"
          />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={saveSlide} 
            disabled={saving}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button 
            onClick={exportPresentation}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Export
          </button>
          <button 
            onClick={() => setIsPresentationMode(true)}
            disabled={allSlides.length === 0}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Trình chiếu
          </button>
        </div>
      </div>

      {/* Main Toolbar */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-2 overflow-x-auto">
        <div className="flex items-center gap-1 border-r pr-2">
          <button onClick={addTextElement} className="p-2 hover:bg-gray-100 rounded" title="Add Text">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          <button onClick={addImageElement} className="p-2 hover:bg-gray-100 rounded" title="Add Image">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <button onClick={addIconElement} className="p-2 hover:bg-gray-100 rounded" title="Add Icon/Emoji">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <div className="relative group">
            <button className="p-2 hover:bg-gray-100 rounded" title="Add Shape">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg p-2 hidden group-hover:block z-10">
              <button onClick={() => addShapeElement('rectangle')} className="block px-3 py-2 hover:bg-gray-100 w-full text-left">Rectangle</button>
              <button onClick={() => addShapeElement('circle')} className="block px-3 py-2 hover:bg-gray-100 w-full text-left">Circle</button>
              <button onClick={() => addShapeElement('triangle')} className="block px-3 py-2 hover:bg-gray-100 w-full text-left">Triangle</button>
              <button onClick={() => addShapeElement('star')} className="block px-3 py-2 hover:bg-gray-100 w-full text-left">Star</button>
            </div>
          </div>
        </div>

        {selectedElement && selectedElement.type === 'text' && (
          <div className="flex items-center gap-2 border-r pr-2">
            <select 
              value={selectedElement.data.fontFamily || 'Arial'}
              onChange={(e) => updateSelectedElementData({ fontFamily: e.target.value })}
              className="border rounded px-2 py-1 text-sm"
            >
              <option>Arial</option>
              <option>Times New Roman</option>
              <option>Courier New</option>
              <option>Georgia</option>
              <option>Verdana</option>
            </select>
            
            <input 
              type="number" 
              value={selectedElement.data.fontSize || 24}
              onChange={(e) => updateSelectedElementData({ fontSize: Number(e.target.value) })}
              className="border rounded px-2 py-1 w-16 text-sm"
              min="8"
              max="200"
            />
            
            <button 
              onClick={() => updateSelectedElementData({ fontWeight: selectedElement.data.fontWeight === 'bold' ? 'normal' : 'bold' })}
              className={`px-2 py-1 border rounded font-bold text-sm ${selectedElement.data.fontWeight === 'bold' ? 'bg-indigo-100 border-indigo-500' : ''}`}
              title="Bold"
            >
              B
            </button>
            
            <button 
              onClick={() => updateSelectedElementData({ fontStyle: selectedElement.data.fontStyle === 'italic' ? 'normal' : 'italic' })}
              className={`px-2 py-1 border rounded italic text-sm ${selectedElement.data.fontStyle === 'italic' ? 'bg-indigo-100 border-indigo-500' : ''}`}
              title="Italic"
            >
              I
            </button>
            
            <button 
              onClick={() => updateSelectedElementData({ textDecoration: selectedElement.data.textDecoration === 'underline' ? 'none' : 'underline' })}
              className={`px-2 py-1 border rounded underline text-sm ${selectedElement.data.textDecoration === 'underline' ? 'bg-indigo-100 border-indigo-500' : ''}`}
              title="Underline"
            >
              U
            </button>
            
            <div className="w-px h-6 bg-gray-300" />
            
            <button 
              onClick={() => updateSelectedElementData({ textAlign: 'left' })}
              className={`p-1 border rounded ${selectedElement.data.textAlign === 'left' ? 'bg-indigo-100 border-indigo-500' : ''}`}
              title="Align Left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
              </svg>
            </button>
            
            <button 
              onClick={() => updateSelectedElementData({ textAlign: 'center' })}
              className={`p-1 border rounded ${selectedElement.data.textAlign === 'center' ? 'bg-indigo-100 border-indigo-500' : ''}`}
              title="Align Center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" />
              </svg>
            </button>
            
            <button 
              onClick={() => updateSelectedElementData({ textAlign: 'right' })}
              className={`p-1 border rounded ${selectedElement.data.textAlign === 'right' ? 'bg-indigo-100 border-indigo-500' : ''}`}
              title="Align Right"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M14 12h6M4 18h16" />
              </svg>
            </button>
            
            <button 
              onClick={() => updateSelectedElementData({ textAlign: 'justify' })}
              className={`p-1 border rounded ${selectedElement.data.textAlign === 'justify' ? 'bg-indigo-100 border-indigo-500' : ''}`}
              title="Justify"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="w-px h-6 bg-gray-300" />
            
            <input 
              type="color" 
              value={selectedElement.data.color || '#000000'}
              onChange={(e) => updateSelectedElementData({ color: e.target.value })}
              className="w-8 h-8 border rounded cursor-pointer"
              title="Text Color"
            />
          </div>
        )}

        {selectedElement && (
          <div className="flex items-center gap-2 border-r pr-2">
            <label className="text-sm">Rotate:</label>
            <input 
              type="number" 
              value={selectedElement.rotation || 0}
              onChange={(e) => updateSelectedElement({ rotation: Number(e.target.value) })}
              className="border rounded px-2 py-1 w-16 text-sm"
              min="0"
              max="360"
            />
            <button onClick={deleteSelectedElement} className="px-2 py-1 border rounded text-red-500 hover:bg-red-50">
              Delete
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <label className="text-sm">Background:</label>
          <input 
            type="color" 
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            className="w-8 h-8 border rounded cursor-pointer"
          />
          <input 
            type="text"
            placeholder="Background Image URL"
            value={backgroundImage}
            onChange={(e) => setBackgroundImage(e.target.value)}
            className="border rounded px-2 py-1 text-sm w-48"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Slide Navigation Sidebar */}
        {allSlides.length > 0 && (
          <div className="w-52 bg-gray-50 border-r overflow-y-auto">
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-semibold text-gray-500 uppercase">
                  Slides ({allSlides.length})
                </div>
                <button
                  onClick={addNewSlide}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Add New Slide"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <div className="space-y-2">
                {allSlides.map((s, idx) => (
                  <div
                    key={s.id}
                    className={`
                      group relative p-2 rounded border-2 transition-all
                      ${s.id === slide?.id 
                        ? 'border-indigo-500 bg-indigo-50 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                      }
                    `}
                  >
                    <div 
                      onClick={() => switchToSlide(s.id)}
                      className="cursor-pointer"
                    >
                      <div className="text-xs font-medium text-gray-700 mb-1">
                        {idx + 1}. {s.title}
                      </div>
                      <div 
                        className="w-full h-20 bg-gray-100 rounded border border-gray-200 overflow-hidden"
                        style={(() => {
                          try {
                            const content = JSON.parse(s.content || '{}')
                            if (content.backgroundImage) {
                              return {
                                backgroundImage: `url(${content.backgroundImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }
                            }
                            return { backgroundColor: content.background || '#ffffff' }
                          } catch {
                            return { backgroundColor: '#ffffff' }
                          }
                        })()}
                      />
                    </div>
                    
                    {/* Slide Actions */}
                    {s.id === slide?.id && (
                      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            moveSlide('up')
                          }}
                          disabled={idx === 0}
                          className="p-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-30"
                          title="Move Up"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            moveSlide('down')
                          }}
                          disabled={idx === allSlides.length - 1}
                          className="p-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-30"
                          title="Move Down"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            duplicateSlide()
                          }}
                          className="p-1 bg-white border rounded hover:bg-gray-100"
                          title="Duplicate"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteCurrentSlide()
                          }}
                          className="p-1 bg-white border rounded hover:bg-red-100 text-red-600"
                          title="Delete"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
          <div 
            ref={canvasRef}
            className="relative bg-white shadow-2xl"
            style={{
              width: '960px',
              height: '540px',
              ...(backgroundImage ? {
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              } : {
                backgroundColor: background
              })
            }}
            onClick={() => {
              setSelectedElement(null)
              setSelectedElementIndex(null)
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Render Elements */}
            {elements.map((elem, idx) => (
              <div
                key={idx}
                className={`absolute ${selectedElement === elem ? 'ring-2 ring-indigo-500' : ''}`}
                style={{
                  left: elem.x,
                  top: elem.y,
                  width: elem.width,
                  height: elem.height,
                  transform: `rotate(${elem.rotation || 0}deg)`,
                  zIndex: elem.zIndex,
                  userSelect: 'none',
                  pointerEvents: 'auto',
                  cursor: isDragging && selectedElementIndex === idx ? 'grabbing' : 'grab'
                }}
                onMouseDown={(e) => handleMouseDown(e, elem, idx)}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!isDragging) {
                    setSelectedElement(elem)
                    setSelectedElementIndex(idx)
                  }
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation()
                  if (elem.type === 'text') {
                    const newText = prompt('Edit text:', elem.data.text)
                    if (newText !== null) {
                      setElements(prev => {
                        const updated = [...prev]
                        updated[idx] = {
                          ...updated[idx],
                          data: { ...updated[idx].data, text: newText }
                        }
                        return updated
                      })
                      setSelectedElement({
                        ...elem,
                        data: { ...elem.data, text: newText }
                      })
                      setSelectedElementIndex(idx)
                    }
                  }
                }}
              >
                {elem.type === 'text' && (
                  <div
                    style={{
                      fontSize: elem.data.fontSize,
                      fontFamily: elem.data.fontFamily,
                      fontWeight: elem.data.fontWeight,
                      fontStyle: elem.data.fontStyle,
                      textDecoration: elem.data.textDecoration || 'none',
                      color: elem.data.color,
                      textAlign: elem.data.textAlign,
                      width: '100%',
                      height: '100%',
                      padding: '8px',
                      overflow: 'hidden',
                      pointerEvents: 'none'
                    }}
                  >
                    {elem.data.text}
                  </div>
                )}

                {elem.type === 'image' && (
                  <img 
                    src={elem.data.imageUrl} 
                    alt={elem.data.alt}
                    className="w-full h-full object-cover"
                    style={{ pointerEvents: 'none' }}
                  />
                )}

                {elem.type === 'shape' && (
                  <div className="w-full h-full" style={{ pointerEvents: 'none' }}>
                    {elem.data.shape === 'rectangle' && (
                      <div 
                        className="w-full h-full"
                        style={{
                          background: elem.data.fill,
                          border: `${elem.data.strokeWidth}px solid ${elem.data.stroke}`,
                          opacity: elem.data.opacity
                        }}
                      />
                    )}
                    {elem.data.shape === 'circle' && (
                      <div 
                        className="w-full h-full rounded-full"
                        style={{
                          background: elem.data.fill,
                          border: `${elem.data.strokeWidth}px solid ${elem.data.stroke}`,
                          opacity: elem.data.opacity
                        }}
                      />
                    )}
                    {elem.data.shape === 'triangle' && (
                      <div
                        style={{
                          width: 0,
                          height: 0,
                          borderLeft: `${elem.width / 2}px solid transparent`,
                          borderRight: `${elem.width / 2}px solid transparent`,
                          borderBottom: `${elem.height}px solid ${elem.data.fill}`,
                          opacity: elem.data.opacity
                        }}
                      />
                    )}
                    {elem.data.shape === 'star' && (
                      <div className="text-center" style={{ fontSize: elem.width, color: elem.data.fill, opacity: elem.data.opacity }}>
                        ★
                      </div>
                    )}
                  </div>
                )}

                {/* Resize handles */}
                {selectedElement === elem && (
                  <>
                    <div className="absolute -right-1 -bottom-1 w-3 h-3 bg-indigo-500 rounded-full cursor-nwse-resize" />
                    <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-500 rounded-full cursor-ew-resize" />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-500 rounded-full cursor-ns-resize" />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Properties Panel */}
        {selectedElement && (
          <div className="w-80 bg-white border-l p-4 overflow-y-auto">
            <h3 className="font-semibold mb-4 flex items-center justify-between">
              Properties
              <button onClick={() => setSelectedElement(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Position X</label>
                <input 
                  type="number" 
                  value={selectedElement.x}
                  onChange={(e) => updateSelectedElement({ x: Number(e.target.value) })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Position Y</label>
                <input 
                  type="number" 
                  value={selectedElement.y}
                  onChange={(e) => updateSelectedElement({ y: Number(e.target.value) })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Width</label>
                <input 
                  type="number" 
                  value={selectedElement.width}
                  onChange={(e) => updateSelectedElement({ width: Number(e.target.value) })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Height</label>
                <input 
                  type="number" 
                  value={selectedElement.height}
                  onChange={(e) => updateSelectedElement({ height: Number(e.target.value) })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Rotation</label>
                <input 
                  type="range" 
                  min="0" 
                  max="360"
                  value={selectedElement.rotation || 0}
                  onChange={(e) => updateSelectedElement({ rotation: Number(e.target.value) })}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 text-center">{selectedElement.rotation || 0}°</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Layer (Z-Index)</label>
                <input 
                  type="number" 
                  value={selectedElement.zIndex}
                  onChange={(e) => updateSelectedElement({ zIndex: Number(e.target.value) })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              {selectedElement.type === 'shape' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Fill Color</label>
                    <input 
                      type="color" 
                      value={selectedElement.data.fill || '#3b82f6'}
                      onChange={(e) => updateSelectedElementData({ fill: e.target.value })}
                      className="w-full h-10 border rounded cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Opacity</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="1"
                      step="0.1"
                      value={selectedElement.data.opacity || 1}
                      onChange={(e) => updateSelectedElementData({ opacity: Number(e.target.value) })}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-500 text-center">{Math.round((selectedElement.data.opacity || 1) * 100)}%</div>
                  </div>
                </>
              )}

              {selectedElement.type === 'text' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Text Content</label>
                  <textarea 
                    value={selectedElement.data.text || ''}
                    onChange={(e) => updateSelectedElementData({ text: e.target.value })}
                    className="w-full border rounded px-3 py-2 h-32"
                  />
                </div>
              )}

              <div className="pt-4 border-t space-y-2">
                <button 
                  onClick={saveCurrentElement}
                  disabled={saving}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 font-medium"
                >
                  {saving ? 'Saving...' : '💾 Save Element'}
                </button>
                
                <button 
                  onClick={deleteSelectedElement}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete Element
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Keyboard shortcuts info */}
      <div className="bg-gray-800 text-white text-xs px-4 py-2 flex items-center justify-between">
        <div className="flex gap-4">
          <span>💡 Tips: Drag elements to move • Use properties panel to adjust • Click "Save Element" to update</span>
        </div>
        <div className="flex gap-2">
          {selectedElement && (
            <>
              <button onClick={() => moveElement('up')} className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">↑</button>
              <button onClick={() => moveElement('down')} className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">↓</button>
              <button onClick={() => moveElement('left')} className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">←</button>
              <button onClick={() => moveElement('right')} className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">→</button>
            </>
          )}
        </div>
      </div>

      {/* Presentation Mode */}
      {isPresentationMode && allSlides.length > 0 && (
        <PresentationMode
          slides={allSlides}
          currentIndex={currentSlideIndex}
          onClose={() => setIsPresentationMode(false)}
          onNavigate={(index) => {
            setCurrentSlideIndex(index)
            if (allSlides[index]) {
              switchToSlide(allSlides[index].id)
            }
          }}
        />
      )}
    </div>
  )
}
