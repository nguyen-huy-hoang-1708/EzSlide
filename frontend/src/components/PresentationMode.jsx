import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function PresentationMode({ slides, currentIndex, onClose, onNavigate }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(currentIndex)
  const [elements, setElements] = useState([])
  const [loading, setLoading] = useState(false)
  const currentSlide = slides[currentSlideIndex]

  // Load elements for current slide
  useEffect(() => {
    if (currentSlide?.id) {
      loadSlideElements(currentSlide.id)
    }
  }, [currentSlide?.id])

  async function loadSlideElements(slideId) {
    setLoading(true)
    try {
      const res = await api.get(`/slides/${slideId}/elements`)
      setElements(res.data || [])
    } catch (err) {
      console.error('Failed to load elements:', err)
      setElements([])
    }
    setLoading(false)
  }

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        // Next slide
        if (currentSlideIndex < slides.length - 1) {
          setCurrentSlideIndex(currentSlideIndex + 1)
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        // Previous slide
        if (currentSlideIndex > 0) {
          setCurrentSlideIndex(currentSlideIndex - 1)
        }
      } else if (e.key === 'Home') {
        // First slide
        setCurrentSlideIndex(0)
      } else if (e.key === 'End') {
        // Last slide
        setCurrentSlideIndex(slides.length - 1)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentSlideIndex, slides.length, onClose])

  if (!currentSlide) return null

  let content = {}
  try {
    content = JSON.parse(currentSlide.content || '{}')
  } catch (e) {
    console.error('Failed to parse slide content')
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Main Slide Display */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          className="relative"
          style={{
            width: '100vw',
            height: '100vh',
            ...(content.backgroundImage ? {
              backgroundImage: `url(${content.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            } : {
              backgroundColor: content.background || '#ffffff'
            })
          }}
        >
          {/* Render Elements */}
          {!loading && elements.map((elem, idx) => (
            <div
              key={idx}
              className="absolute"
              style={{
                left: `${(elem.x / 960) * 100}vw`,
                top: `${(elem.y / 540) * 100}vh`,
                width: `${(elem.width / 960) * 100}vw`,
                height: `${(elem.height / 540) * 100}vh`,
                transform: `rotate(${elem.rotation || 0}deg)`,
                zIndex: elem.zIndex
              }}
            >
              {elem.type === 'text' && (
                <div
                  style={{
                    fontSize: `${(elem.data.fontSize / 960) * 100}vw`,
                    fontFamily: elem.data.fontFamily,
                    fontWeight: elem.data.fontWeight,
                    fontStyle: elem.data.fontStyle,
                    textDecoration: elem.data.textDecoration || 'none',
                    color: elem.data.color,
                    textAlign: elem.data.textAlign,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.5vw'
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
                />
              )}

              {elem.type === 'shape' && (
                <div className="w-full h-full">
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
                        opacity: elem.data.opacity,
                        transform: 'scale(var(--scale))'
                      }}
                    />
                  )}
                  {elem.data.shape === 'star' && (
                    <div 
                      className="text-center flex items-center justify-center" 
                      style={{ 
                        fontSize: `${(elem.width / 960) * 100}vw`, 
                        color: elem.data.fill, 
                        opacity: elem.data.opacity,
                        width: '100%',
                        height: '100%'
                      }}
                    >
                      ★
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full">
        <button
          onClick={() => currentSlideIndex > 0 && setCurrentSlideIndex(currentSlideIndex - 1)}
          disabled={currentSlideIndex === 0}
          className="text-white p-2 hover:bg-white/20 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-white font-medium">
          {currentSlideIndex + 1} / {slides.length}
        </div>

        <button
          onClick={() => currentSlideIndex < slides.length - 1 && setCurrentSlideIndex(currentSlideIndex + 1)}
          disabled={currentSlideIndex === slides.length - 1}
          className="text-white p-2 hover:bg-white/20 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="w-px h-6 bg-white/30 mx-2" />

        <button
          onClick={onClose}
          className="text-white px-4 py-2 hover:bg-white/20 rounded-full transition font-medium"
        >
          Exit (Esc)
        </button>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="absolute top-8 right-8 bg-black/50 backdrop-blur-sm text-white p-4 rounded-lg text-sm">
        <div className="font-semibold mb-2">⌨️ Keyboard Shortcuts</div>
        <div className="space-y-1 text-xs">
          <div>→ / ↓ / Space: Next slide</div>
          <div>← / ↑: Previous slide</div>
          <div>Home: First slide</div>
          <div>End: Last slide</div>
          <div>Esc: Exit presentation</div>
        </div>
      </div>
    </div>
  )
}
