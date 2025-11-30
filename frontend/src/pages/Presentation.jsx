import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import Timer from '../components/Timer'

export default function Presentation(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [slides, setSlides] = useState([])
  const [index, setIndex] = useState(0)

  useEffect(()=>{
    async function load(){
      try{
        const res = await api.get('/slides')
        setSlides(res.data || [])
      }catch(e){ console.error('Could not load slides', e) }
    }
    load()
  }, [])

  useEffect(()=>{
    // set index from current id param
    const i = slides.findIndex(s => s.id === Number(id))
    if (i >= 0) setIndex(i)
  }, [id, slides])

  const current = slides[index]
  const next = slides[index + 1]
  const prev = slides[index - 1]

  function goTo(idx){
    if (idx < 0 || idx >= slides.length) return
    const s = slides[idx]
    setIndex(idx)
    navigate(`/presentation/${s.id}`)
  }

  useEffect(()=>{
    function onKey(e){
      if (e.key === 'ArrowRight' || e.key === ' ') goTo(index+1)
      if (e.key === 'ArrowLeft') goTo(index-1)
      if (e.key === 'Escape') navigate(`/editor/${current?.id}`)
    }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  }, [index, slides, current, navigate])

  if (!current) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">No slides to present</div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-3 gap-6">
        {/* Audience view */}
        <div className="col-span-2 bg-white rounded border p-6 h-[70vh] flex items-center justify-center">
          <div className="w-full h-full border rounded flex items-center justify-center text-4xl">{current.title || 'プレゼンテーション'}</div>
        </div>

        {/* Presenter view */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded border p-4 flex items-center justify-between">
            <div className="text-lg font-semibold">{current.title}</div>
            <div>
              <button onClick={()=>navigate(`/editor/${current.id}`)} className="px-3 py-1 border rounded">✕</button>
            </div>
          </div>

          <div className="bg-white rounded border p-4">
            <div className="text-sm text-gray-600 mb-2">次のスライド</div>
            <div className="h-28 bg-gray-50 rounded flex items-center justify-center">{next ? next.title : 'End of Presentation'}</div>
          </div>

          <div className="bg-white rounded border p-4 flex-1 flex flex-col items-center justify-center">
            <Timer />
          </div>

          <div className="flex gap-2">
            <button onClick={()=>goTo(index-1)} className="flex-1 px-3 py-2 border rounded">Prev</button>
            <button onClick={()=>goTo(index+1)} className="flex-1 px-3 py-2 border rounded">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
