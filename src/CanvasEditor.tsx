import { useEffect, useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'

type ElementKind = 'shape' | 'text' | 'image'

type BaseElement = {
  id: string
  type: ElementKind
  x: number
  y: number
  width: number
  height: number
  rotation?: number
  opacity: number
  visible?: boolean
}

type ShapeElement = BaseElement & {
  type: 'shape'
  fill: string
  borderRadius: number
}

type TextElement = BaseElement & {
  type: 'text'
  text: string
  color: string
  fontSize: number
  fontFamily: string
  fontWeight: number
  align: 'left' | 'center' | 'right'
  lineHeight: number
}

type ImageElement = BaseElement & {
  type: 'image'
  imageUrl: string
  borderRadius: number
  objectFit: 'cover' | 'contain'
}

type CanvasElement = ShapeElement | TextElement | ImageElement

type Template = {
  id: string
  title: string
  description: string
  background: string
  elements: CanvasElement[]
}

type Slide = {
  id: string
  title: string
  elements: CanvasElement[]
  background: string
  updatedAt: string
}

const CANVAS_WIDTH = 960
const CANVAS_HEIGHT = 540

const createId = () => crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const templates: Template[] = [
  {
    id: 'pitch',
    title: 'Product pitch',
    description: 'Bold hero slide for startup decks.',
    background: 'linear-gradient(135deg, #0f172a, #312e81)',
    elements: [
      {
        id: createId(),
        type: 'text',
        text: 'Nova Analytics',
        x: 72,
        y: 80,
        width: 420,
        height: 120,
        color: '#f8fafc',
        fontSize: 54,
        fontFamily: 'Space Grotesk, Inter, sans-serif',
        fontWeight: 600,
        align: 'left',
        lineHeight: 1.1,
        opacity: 1,
      },
      {
        id: createId(),
        type: 'text',
        text: 'Turning messy product usage data into crisp product insights.',
        x: 72,
        y: 200,
        width: 420,
        height: 160,
        color: '#c7d2fe',
        fontSize: 22,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 400,
        align: 'left',
        lineHeight: 1.4,
        opacity: 1,
      },
      {
        id: createId(),
        type: 'shape',
        x: 640,
        y: 80,
        width: 240,
        height: 240,
        fill: 'rgba(99, 102, 241, 0.3)',
        borderRadius: 999,
        rotation: 0,
        opacity: 1,
      },
      {
        id: createId(),
        type: 'shape',
        x: 520,
        y: 220,
        width: 120,
        height: 120,
        fill: 'rgba(14, 165, 233, 0.35)',
        borderRadius: 32,
        rotation: 0,
        opacity: 1,
      },
      {
        id: createId(),
        type: 'image',
        x: 540,
        y: 60,
        width: 320,
        height: 420,
        imageUrl:
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
        borderRadius: 36,
        objectFit: 'cover',
        rotation: 0,
        opacity: 1,
      },
    ],
  },
  {
    id: 'report',
    title: 'Status report',
    description: 'Clean layout for weekly updates.',
    background: '#f6f7fb',
    elements: [
      {
        id: createId(),
        type: 'shape',
        x: 60,
        y: 60,
        width: 840,
        height: 420,
        borderRadius: 32,
        fill: '#ffffff',
        opacity: 1,
      },
      {
        id: createId(),
        type: 'text',
        text: 'Growth metrics — Q4 snapshot',
        x: 120,
        y: 100,
        width: 420,
        height: 80,
        color: '#111827',
        fontSize: 38,
        fontFamily: 'Space Grotesk, Inter, sans-serif',
        fontWeight: 600,
        align: 'left',
        lineHeight: 1.2,
        opacity: 1,
      },
      {
        id: createId(),
        type: 'text',
        text: '• Activation up 32%\n• Expansion deals +4\n• Retention steady at 93%',
        x: 120,
        y: 200,
        width: 360,
        height: 200,
        color: '#374151',
        fontSize: 22,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        align: 'left',
        lineHeight: 1.5,
        opacity: 1,
      },
      {
        id: createId(),
        type: 'shape',
        x: 540,
        y: 140,
        width: 300,
        height: 200,
        borderRadius: 24,
        fill: '#dbeafe',
        opacity: 1,
      },
      {
        id: createId(),
        type: 'text',
        text: 'Next focus: onboarding simplification & enterprise SOC2.',
        x: 540,
        y: 360,
        width: 300,
        height: 120,
        color: '#1f2937',
        fontSize: 20,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        align: 'left',
        lineHeight: 1.4,
        opacity: 1,
      },
    ],
  },
]

const brandSwatches = ['#0f172a', '#1d1b84', '#f97316', '#f4f1ff', '#ffffff']

const samplePhotos = [
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=600&q=80',
]

const cloneCanvasElement = (element: CanvasElement): CanvasElement => {
  if (element.type === 'shape') {
    const clone: ShapeElement = {
      ...element,
      id: createId(),
      visible: element.visible ?? true,
    }
    return clone
  }
  if (element.type === 'text') {
    const clone: TextElement = {
      ...element,
      id: createId(),
      visible: element.visible ?? true,
    }
    return clone
  }
  const clone: ImageElement = {
    ...element,
    id: createId(),
    visible: element.visible ?? true,
  }
  return clone
}

const cloneSlides = (slides: Slide[]): Slide[] =>
  slides.map((slide) => ({
    ...slide,
    elements: slide.elements.map((element) => ({ ...element })),
  }))

const createSlideFromTemplate = (title: string, template: Template): Slide => ({
  id: createId(),
  title,
  elements: template.elements.map(cloneCanvasElement),
  background: template.background,
  updatedAt: new Date().toISOString(),
})

const createBlankSlide = (title: string): Slide => ({
  id: createId(),
  title,
  elements: [],
  background: '#ffffff',
  updatedAt: new Date().toISOString(),
})

const initialSlides: Slide[] = [
  createSlideFromTemplate('Slide 1', templates[0]),
  createSlideFromTemplate('Slide 2', templates[1]),
]

const CanvasEditor = () => {
  const [slides, setSlides] = useState<Slide[]>(() => initialSlides)
  const [activeSlideId, setActiveSlideId] = useState(initialSlides[0].id)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [dragState, setDragState] = useState<{
    id: string
    offsetX: number
    offsetY: number
    stageRect: DOMRect
  } | null>(null)
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true)
  const [shareOpen, setShareOpen] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [historyPointer, setHistoryPointer] = useState(-1)
  const [historySize, setHistorySize] = useState(0)
  const stageRef = useRef<HTMLDivElement>(null)
  const historyRef = useRef<{ entries: Slide[][]; pointer: number }>({ entries: [], pointer: -1 })
  const slidesRef = useRef(slides)

  const activeSlide = slides.find((slide) => slide.id === activeSlideId) ?? slides[0]
  const elements = activeSlide?.elements ?? []
  const background = activeSlide?.background ?? templates[0].background

  const selectedElement = useMemo(
    () => elements.find((element) => element.id === selectedElementId),
    [elements, selectedElementId],
  )

  const recordHistory = (nextSlides: Slide[]) => {
    const cloned = cloneSlides(nextSlides)
    const trimmed = historyRef.current.entries.slice(0, historyRef.current.pointer + 1)
    const updated = [...trimmed, cloned]
    historyRef.current = { entries: updated, pointer: updated.length - 1 }
    setHistoryPointer(historyRef.current.pointer)
    setHistorySize(updated.length)
  }

  const applySlideMutation = (mutator: (prev: Slide[]) => Slide[]) => {
    setSlides((prev) => {
      const next = mutator(prev)
      recordHistory(next)
      return next
    })
  }

  const updateActiveSlide = (updater: (slide: Slide) => Slide) => {
    if (!activeSlideId) return
    applySlideMutation((prev) =>
      prev.map((slide) => (slide.id === activeSlideId ? updater(slide) : slide)),
    )
  }

  const mutateElements = (mutator: (elements: CanvasElement[]) => CanvasElement[]) => {
    updateActiveSlide((slide) => ({
      ...slide,
      elements: mutator(slide.elements),
      updatedAt: new Date().toISOString(),
    }))
  }

  useEffect(() => {
    recordHistory(slides)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    slidesRef.current = slides
  }, [slides])

  useEffect(() => {
    if (!statusMessage) return
    const timer = setTimeout(() => setStatusMessage(null), 2600)
    return () => clearTimeout(timer)
  }, [statusMessage])

  const loadTemplate = (template: Template) => {
    updateActiveSlide((slide) => ({
      ...slide,
      elements: template.elements.map(cloneCanvasElement),
      background: template.background,
      updatedAt: new Date().toISOString(),
    }))
    setSelectedElementId(null)
  }

  const addShape = (variant: 'rectangle' | 'circle' | 'pill') => {
    const width = variant === 'circle' ? 180 : 240
    const height = variant === 'circle' ? 180 : variant === 'pill' ? 100 : 160
    const borderRadius =
      variant === 'circle' ? 999 : variant === 'pill' ? height / 2 : 24
    const newShape: ShapeElement = {
      id: createId(),
      type: 'shape',
      x: 80,
      y: 80,
      width,
      height,
      fill: '#7c3aed',
      borderRadius,
      opacity: 0.95,
      visible: true,
    }
    mutateElements((prev) => [...prev, newShape])
    setSelectedElementId(newShape.id)
  }

  const addTextBlock = () => {
    const newText: TextElement = {
      id: createId(),
      type: 'text',
      text: 'Edit your message in the panel on the right.',
      x: 120,
      y: 120,
      width: 400,
      height: 140,
      color: '#111827',
      fontSize: 32,
      fontFamily: 'Space Grotesk, Inter, sans-serif',
      fontWeight: 600,
      align: 'left',
      lineHeight: 1.2,
      opacity: 1,
      visible: true,
    }
    mutateElements((prev) => [...prev, newText])
    setSelectedElementId(newText.id)
  }

  const addImage = (imageUrl?: string) => {
    const newImage: ImageElement = {
      id: createId(),
      type: 'image',
      x: 520,
      y: 120,
      width: 280,
      height: 360,
      imageUrl:
        imageUrl ??
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
      borderRadius: 32,
      objectFit: 'cover',
      opacity: 1,
      visible: true,
    }
    mutateElements((prev) => [...prev, newImage])
    setSelectedElementId(newImage.id)
  }

  const updateSelectedElement = (updater: (element: CanvasElement) => CanvasElement) => {
    if (!selectedElement) return
    mutateElements((prev) =>
      prev.map((element) => (element.id === selectedElement.id ? updater(element) : element)),
    )
  }

  const duplicateSelected = () => {
    if (!selectedElement) return
    const clone: CanvasElement = {
      ...selectedElement,
      id: createId(),
      x: clamp(selectedElement.x + 32, 0, CANVAS_WIDTH - selectedElement.width),
      y: clamp(selectedElement.y + 32, 0, CANVAS_HEIGHT - selectedElement.height),
    }
    mutateElements((prev) => [...prev, clone])
    setSelectedElementId(clone.id)
  }

  const deleteSelected = () => {
    if (!selectedElement) return
    mutateElements((prev) => prev.filter((element) => element.id !== selectedElement.id))
    setSelectedElementId(null)
  }

  const bringToFront = () => {
    if (!selectedElement) return
    mutateElements((prev) => {
      const without = prev.filter((el) => el.id !== selectedElement.id)
      return [...without, selectedElement]
    })
  }

  const toggleVisibility = () => {
    if (!selectedElement) return
    updateSelectedElement((element) => ({
      ...element,
      visible: element.visible === false ? true : false,
    }))
  }

  const applyBulletStyle = () => {
    if (!selectedElement || selectedElement.type !== 'text') return
    const hasBullet = selectedElement.text.trim().startsWith('•')
    const nextText = hasBullet
      ? selectedElement.text.replace(/^•\s?/gm, '')
      : selectedElement.text
          .split('\n')
          .map((line) => (line.trim().length ? `• ${line}` : line))
          .join('\n')
    updateSelectedElement((element) => ({
      ...element,
      text: nextText,
    }))
  }

  const startDrag = (event: React.PointerEvent, id: string) => {
    event.stopPropagation()
    setSelectedElementId(id)
    const stageRect = stageRef.current?.getBoundingClientRect()
    const targetRect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    if (!stageRect) return
    setDragState({
      id,
      offsetX: event.clientX - targetRect.left,
      offsetY: event.clientY - targetRect.top,
      stageRect,
    })
  }

  useEffect(() => {
    if (!dragState) return

    const handlePointerMove = (event: PointerEvent) => {
      setSlides((prev) =>
        prev.map((slide) => {
          if (slide.id !== activeSlideId) return slide
          return {
            ...slide,
            elements: slide.elements.map((element) => {
              if (element.id !== dragState.id) return element
              const nextX = clamp(
                event.clientX - dragState.stageRect.left - dragState.offsetX,
                0,
                CANVAS_WIDTH - element.width,
              )
              const nextY = clamp(
                event.clientY - dragState.stageRect.top - dragState.offsetY,
                0,
                CANVAS_HEIGHT - element.height,
              )
              return { ...element, x: nextX, y: nextY }
            }),
            updatedAt: new Date().toISOString(),
          }
        }),
      )
    }

    const handlePointerUp = () => {
      setDragState(null)
      recordHistory(slidesRef.current)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [dragState, activeSlideId])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!selectedElement) return
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault()
        deleteSelected()
      }
      if (event.key === 'd' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        duplicateSelected()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selectedElement])

  const exportAsPng = async () => {
    if (!stageRef.current) return
    const canvas = await html2canvas(stageRef.current)
    const link = document.createElement('a')
    link.download = 'slide.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleSave = () => {
    setStatusMessage('All changes saved')
  }

  const handleStartPresentation = () => {
    setStatusMessage('Starting presentation preview...')
  }

  const handleUndo = () => {
    if (historyPointer <= 0) return
    const newPointer = historyPointer - 1
    const snapshot = cloneSlides(historyRef.current.entries[newPointer])
    historyRef.current.pointer = newPointer
    setSlides(snapshot)
    setHistoryPointer(newPointer)
    setSelectedElementId(null)
    setActiveSlideId(snapshot[0]?.id ?? activeSlideId)
  }

  const handleRedo = () => {
    if (historyPointer >= historySize - 1) return
    const newPointer = historyPointer + 1
    const snapshot = cloneSlides(historyRef.current.entries[newPointer])
    historyRef.current.pointer = newPointer
    setSlides(snapshot)
    setHistoryPointer(newPointer)
    setSelectedElementId(null)
    setActiveSlideId(snapshot[0]?.id ?? activeSlideId)
  }

  const addSlide = () => {
    const newSlide = createBlankSlide(`Slide ${slides.length + 1}`)
    applySlideMutation((prev) => [...prev, newSlide])
    setActiveSlideId(newSlide.id)
    setSelectedElementId(null)
  }

  const deleteSlide = (slideId: string) => {
    if (slides.length === 1) return
    applySlideMutation((prev) => prev.filter((slide) => slide.id !== slideId))
    if (activeSlideId === slideId) {
      const nextSlide = slides.find((slide) => slide.id !== slideId)
      if (nextSlide) setActiveSlideId(nextSlide.id)
    }
    setSelectedElementId(null)
  }

  const setBackgroundValue = (value: string) => {
    updateActiveSlide((slide) => ({
      ...slide,
      background: value,
      updatedAt: new Date().toISOString(),
    }))
  }

  const canUndo = historyPointer > 0
  const canRedo = historyPointer >= 0 && historyPointer < historySize - 1

  return (
    <div className="editor-shell">
      <aside className={`panel left-panel ${isLeftPanelOpen ? '' : 'is-hidden'}`}>
        <div className="panel-section">
          <h2>Layouts</h2>
          <p className="muted">Start from a curated slide template.</p>
          <div className="template-grid">
            {templates.map((template) => (
              <button
                key={template.id}
                className="template-card"
                onClick={() => loadTemplate(template)}
              >
                <span className="template-thumb" style={{ background: template.background }} />
                <strong>{template.title}</strong>
                <span>{template.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="panel-section">
          <h2>Elements</h2>
          <div className="element-buttons">
            <button onClick={() => addShape('rectangle')}>Rectangle</button>
            <button onClick={() => addShape('pill')}>Accent pill</button>
            <button onClick={() => addShape('circle')}>Circle</button>
            <button onClick={addTextBlock}>Heading</button>
            <button onClick={() => addImage()}>Photo</button>
          </div>
        </div>

        <div className="panel-section">
          <h2>Brand colors</h2>
          <p className="muted">Click to set the slide background.</p>
          <div className="swatch-row">
            {brandSwatches.map((color) => (
              <button
                key={color}
                className="color-swatch"
                style={{ background: color }}
                onClick={() => setBackgroundValue(color)}
                aria-label={`Set background to ${color}`}
              />
            ))}
          </div>
        </div>

        <div className="panel-section">
          <h2>Stock photos</h2>
          <div className="photo-grid">
            {samplePhotos.map((url) => (
              <button key={url} onClick={() => addImage(url)} className="photo-chip">
                <img src={url} alt="Stock suggestion" />
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="editor-main">
        <div className="top-toolbar">
          <div className="toolbar-left">
            <button className="toolbar-button" onClick={() => setIsLeftPanelOpen((prev) => !prev)}>
              ☰
            </button>
            <span className="toolbar-label">Editing {activeSlide?.title}</span>
          </div>
          <div className="toolbar-actions">
            <button className="toolbar-button" onClick={handleSave} title="Save slide">
              💾
            </button>
            <button
              className="toolbar-button"
              onClick={handleUndo}
              title="Undo"
              disabled={!canUndo}
            >
              ↶
            </button>
            <button
              className="toolbar-button"
              onClick={handleRedo}
              title="Redo"
              disabled={!canRedo}
            >
              ↷
            </button>
            <button className="toolbar-button" onClick={() => setShareOpen(true)} title="Share">
              ⤴︎
            </button>
            <button className="toolbar-button" onClick={exportAsPng} title="Export PNG">
              ⬇︎
            </button>
            <button className="primary toolbar-start" onClick={handleStartPresentation}>
              Start presentation
            </button>
          </div>
          {statusMessage && <span className="toolbar-status">{statusMessage}</span>}
        </div>

        <div className="editor-body">
          <aside className="slide-panel">
            <div className="slide-panel-header">
              <h3>Slides</h3>
              <button className="toolbar-button" onClick={addSlide}>
                ＋
              </button>
            </div>
            <div className="slide-list">
              {slides.map((slide, index) => (
                <div key={slide.id} className="slide-list-item">
                  <button
                    className={`slide-thumb-card ${slide.id === activeSlideId ? 'is-active' : ''}`}
                    onClick={() => {
                      setActiveSlideId(slide.id)
                      setSelectedElementId(null)
                    }}
                  >
                    <div className="slide-thumb" style={{ background: slide.background }}>
                      <span>{slide.title}</span>
                    </div>
                    <span className="muted small">Slide {index + 1}</span>
                  </button>
                  <button
                    className="mini-delete"
                    onClick={() => deleteSlide(slide.id)}
                    disabled={slides.length === 1}
                    title="Delete slide"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </aside>

          <main className="workspace">
            <div className="canvas-wrapper">
              <div
                className="canvas-stage"
                ref={stageRef}
                style={{ background }}
                onPointerDown={() => setSelectedElementId(null)}
              >
                <div className="canvas-grid">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <span key={index} />
                  ))}
                </div>
                {elements.map((element) => {
                  const isSelected = selectedElementId === element.id
                  const isHidden = element.visible === false
                  return (
                    <button
                      key={element.id}
                      className={`canvas-element ${isSelected ? 'is-selected' : ''} ${
                        isHidden ? 'is-hidden' : ''
                      }`}
                      style={{
                        width: element.width,
                        height: element.height,
                        transform: `translate(${element.x}px, ${element.y}px)`,
                        opacity: isHidden ? 0.2 : element.opacity,
                      }}
                      onPointerDown={(event) => startDrag(event, element.id)}
                    >
                      {element.type === 'shape' && (
                        <span
                          className="shape-node"
                          style={{
                            background: element.fill,
                            borderRadius: element.borderRadius,
                          }}
                        />
                      )}
                      {element.type === 'text' && (
                        <span
                          className="text-node"
                          style={{
                            color: element.color,
                            fontSize: element.fontSize,
                            fontFamily: element.fontFamily,
                            fontWeight: element.fontWeight,
                            textAlign: element.align,
                            lineHeight: element.lineHeight,
                          }}
                        >
                          {element.text}
                        </span>
                      )}
                      {element.type === 'image' && (
                        <img
                          src={element.imageUrl}
                          alt="Custom"
                          style={{
                            borderRadius: element.borderRadius,
                            objectFit: element.objectFit,
                          }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </main>

          <aside className="panel right-panel">
            <div className="panel-section">
              <h2>Canvas</h2>
              <label className="field">
                <span>Background</span>
                <input
                  type="text"
                  value={background}
                  onChange={(event) => setBackgroundValue(event.target.value)}
                  placeholder="hex or gradient"
                />
              </label>
              <p className="muted small">
                Accepts solid colors (e.g. #111827) or CSS gradients (e.g. linear-gradient()).
              </p>
            </div>

            <div className="panel-section">
              <h2>Selection</h2>
              {!selectedElement && <p className="muted">Select an object to edit its styles.</p>}

              {selectedElement && (
                <>
                  <div className="selection-meta">
                    <strong>{selectedElement.type.toUpperCase()}</strong>
                    <span>
                      {Math.round(selectedElement.x)} × {Math.round(selectedElement.y)}
                    </span>
                  </div>

                  <div className="grid-two">
                    <label className="field">
                      <span>X</span>
                      <input
                        type="number"
                        value={Math.round(selectedElement.x)}
                        onChange={(event) =>
                          updateSelectedElement((element) => ({
                            ...element,
                            x: clamp(
                              Number(event.target.value),
                              0,
                              CANVAS_WIDTH - element.width,
                            ),
                          }))
                        }
                      />
                    </label>
                    <label className="field">
                      <span>Y</span>
                      <input
                        type="number"
                        value={Math.round(selectedElement.y)}
                        onChange={(event) =>
                          updateSelectedElement((element) => ({
                            ...element,
                            y: clamp(
                              Number(event.target.value),
                              0,
                              CANVAS_HEIGHT - element.height,
                            ),
                          }))
                        }
                      />
                    </label>
                  </div>

                  <div className="grid-two">
                    <label className="field">
                      <span>Width</span>
                      <input
                        type="number"
                        value={Math.round(selectedElement.width)}
                        onChange={(event) =>
                          updateSelectedElement((element) => ({
                            ...element,
                            width: clamp(Number(event.target.value), 20, CANVAS_WIDTH),
                          }))
                        }
                      />
                    </label>
                    <label className="field">
                      <span>Height</span>
                      <input
                        type="number"
                        value={Math.round(selectedElement.height)}
                        onChange={(event) =>
                          updateSelectedElement((element) => ({
                            ...element,
                            height: clamp(Number(event.target.value), 20, CANVAS_HEIGHT),
                          }))
                        }
                      />
                    </label>
                  </div>

                  <label className="field">
                    <span>Opacity</span>
                    <input
                      type="range"
                      min={0.2}
                      max={1}
                      step={0.01}
                      value={selectedElement.opacity}
                      onChange={(event) =>
                        updateSelectedElement((element) => ({
                          ...element,
                          opacity: Number(event.target.value),
                        }))
                      }
                    />
                  </label>

                  {selectedElement.type === 'shape' && (
                    <>
                      <label className="field">
                        <span>Fill</span>
                        <input
                          type="text"
                          value={selectedElement.fill}
                          onChange={(event) =>
                            updateSelectedElement((element) => ({
                              ...element,
                              fill: event.target.value,
                            }))
                          }
                        />
                      </label>
                      <label className="field">
                        <span>Border radius</span>
                        <input
                          type="range"
                          min={0}
                          max={200}
                          value={selectedElement.borderRadius}
                          onChange={(event) =>
                            updateSelectedElement((element) => ({
                              ...element,
                              borderRadius: Number(event.target.value),
                            }))
                          }
                        />
                      </label>
                    </>
                  )}

                  {selectedElement.type === 'text' && (
                    <>
                      <label className="field">
                        <span>Copy</span>
                        <textarea
                          value={selectedElement.text}
                          onChange={(event) =>
                            updateSelectedElement((element) => ({
                              ...element,
                              text: event.target.value,
                            }))
                          }
                          rows={4}
                        />
                      </label>
                      <label className="field">
                        <span>Color</span>
                        <input
                          type="text"
                          value={selectedElement.color}
                          onChange={(event) =>
                            updateSelectedElement((element) => ({
                              ...element,
                              color: event.target.value,
                            }))
                          }
                        />
                      </label>
                      <label className="field">
                        <span>Font size</span>
                        <input
                          type="range"
                          min={14}
                          max={72}
                          value={selectedElement.fontSize}
                          onChange={(event) =>
                            updateSelectedElement((element) => ({
                              ...element,
                              fontSize: Number(event.target.value),
                            }))
                          }
                        />
                      </label>
                    </>
                  )}

                  {selectedElement.type === 'image' && (
                    <>
                      <label className="field">
                        <span>Image URL</span>
                        <input
                          type="text"
                          value={selectedElement.imageUrl}
                          onChange={(event) =>
                            updateSelectedElement((element) => ({
                              ...element,
                              imageUrl: event.target.value,
                            }))
                          }
                        />
                      </label>
                      <label className="field">
                        <span>Corner radius</span>
                        <input
                          type="range"
                          min={0}
                          max={120}
                          value={selectedElement.borderRadius}
                          onChange={(event) =>
                            updateSelectedElement((element) => ({
                              ...element,
                              borderRadius: Number(event.target.value),
                            }))
                          }
                        />
                      </label>
                    </>
                  )}

                  <div className="selection-controls">
                    <div className="add-submenu">
                      <button className="ghost" onClick={() => setShowAddMenu((prev) => !prev)}>
                        Add &amp; submenu
                      </button>
                      {showAddMenu && (
                        <div className="submenu-panel">
                          <button onClick={addTextBlock}>Text block</button>
                          <button onClick={() => addShape('rectangle')}>Shape</button>
                          <button onClick={() => addImage()}>Image</button>
                        </div>
                      )}
                    </div>
                    <div className="selection-actions">
                      <button className="ghost" onClick={deleteSelected}>
                        Delete
                      </button>
                      <button
                        className="ghost"
                        onClick={applyBulletStyle}
                        disabled={selectedElement.type !== 'text'}
                      >
                        Change style
                      </button>
                      <button className="ghost" onClick={toggleVisibility}>
                        {selectedElement.visible === false ? 'Toggle on' : 'Toggle off'}
                      </button>
                      <button className="ghost" onClick={bringToFront}>
                        Bring front
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="panel-section">
              <h2>Slide actions</h2>
              <div className="action-row">
                <button onClick={() => mutateElements(() => [])}>Clear slide</button>
                <button onClick={duplicateSelected} disabled={!selectedElement}>
                  Duplicate selection
                </button>
                <button className="danger" onClick={() => deleteSlide(activeSlideId)}>
                  Delete slide
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {shareOpen && (
        <div className="share-overlay" role="dialog" aria-modal="true">
          <div className="share-modal">
            <header>
              <h3>Share or export</h3>
              <button className="toolbar-button" onClick={() => setShareOpen(false)}>
                ✕
              </button>
            </header>
            <p className="muted small">Choose how you want to distribute this slide.</p>
            <div className="share-actions">
              <button className="primary" onClick={exportAsPng}>
                Download PNG
              </button>
              <button className="ghost" onClick={() => setStatusMessage('Share link copied!')}>
                Copy share link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CanvasEditor

