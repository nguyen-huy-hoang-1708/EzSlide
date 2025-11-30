import React, { useEffect, useState, useRef } from 'react'
import Layout from '../components/Layout'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import ExportModal from '../components/ExportModal'
import ConfirmModal from '../components/ConfirmModal'

export default function Editor(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [slide, setSlide] = useState(null)
  const [slides, setSlides] = useState([])
  const [contentText, setContentText] = useState('')
  const [undoStack, setUndoStack] = useState([])
  const [redoStack, setRedoStack] = useState([])
  const [saving, setSaving] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState('')
  const [confirmAction, setConfirmAction] = useState(()=>()=>{})
  const mounted = useRef(false)

  useEffect(()=>{
    mounted.current = true
    async function loadSlides(){
      try{
        const res = await api.get('/slides')
        setSlides(res.data || [])
      }catch(err){
        console.error('Cannot fetch slides list', err)
      }
    }
    loadSlides()
    return ()=>{ mounted.current = false }
  }, [])

  useEffect(()=>{
    async function load(){
      if (id === 'new'){
        // create a new slide
        try{
          const res = await api.post('/slides', { title: 'Untitled', content: {} })
          const s = res.data
          navigate(`/editor/${s.id}`, { replace: true })
        }catch(err){ console.error('Cannot create slide', err) }
        return
      }
      const numericId = Number(id)
      if (!Number.isFinite(numericId)) return
      try{
        const res = await api.get(`/slides/${numericId}`)
        setSlide(res.data)
        // content is JSON string
        try{ setContentText(JSON.parse(res.data.content).text || '') }catch(e){ setContentText('') }
      }catch(err){ console.error('Cannot load slide', err) }
    }
    load()
  }, [id, navigate])

  function pushUndo(value){
    setUndoStack(prev => [...prev, value])
    setRedoStack([])
  }

  function undo(){
    setUndoStack(prev => {
      if (prev.length === 0) return prev
      const last = prev[prev.length-1]
      setRedoStack(r => [contentText, ...r])
      setContentText(last)
      return prev.slice(0, -1)
    })
  }

  function redo(){
    setRedoStack(prev => {
      if (prev.length === 0) return prev
      const next = prev[0]
      setUndoStack(u => [...u, contentText])
      setContentText(next)
      return prev.slice(1)
    })
  }

  async function save(){
    if (!slide) return
    setSaving(true)
    try{
      const data = { title: slide.title || 'Untitled', content: JSON.stringify({ text: contentText }) }
      const res = await api.put(`/slides/${slide.id}`, data)
      setSlide(res.data)
    }catch(err){ console.error(err) }
    setSaving(false)
  }

  async function exportSlide(format='pdf'){
    if (!slide) return
    try{
      const res = await api.get(`/slides/${slide.id}/export?format=${format}`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `slide-${slide.id}.${format}`
      a.click()
      window.URL.revokeObjectURL(url)
    }catch(err){ console.error('Export failed', err) }
  }

  async function deleteSlide(){
    if (!slide) return
    setConfirmMessage('このスライドを削除しますか？')
    setConfirmAction(()=>async ()=>{
      try{
        await api.delete(`/slides/${slide.id}`)
        navigate('/slides')
      }catch(err){ console.error(err) }
    })
    setConfirmOpen(true)
  }

  function addTextBlock(){
    pushUndo(contentText)
    setContentText(prev => prev + '\nNew text block')
  }

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* Editor toolbar */}
        <div className="flex items-center gap-3 p-3 border-b bg-white">
          <button onClick={save} className="px-3 py-1 border rounded bg-green-500 text-white">{saving ? 'Saving...' : 'Save'}</button>
          <button onClick={undo} className="px-3 py-1 border rounded">Undo</button>
          <button onClick={redo} className="px-3 py-1 border rounded">Redo</button>
          <button onClick={()=>document.getElementById('fileInput')?.click()} className="px-3 py-1 border rounded">Upload</button>
          <input id="fileInput" type="file" className="hidden" />
          <button onClick={()=>setExportOpen(true)} className="px-3 py-1 border rounded">Export</button>
          <button onClick={()=>navigate(`/presentation/${slide?.id}`)} className="px-3 py-1 border rounded">Start Presentation</button>
        </div>

        {/* Editor body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left thumbnails */}
          <div className="w-56 overflow-auto border-r p-2 bg-gray-50">
            {slides.map(s => (
              <div key={s.id} className="p-2 mb-2 border rounded cursor-pointer" onClick={()=>navigate(`/editor/${s.id}`)}>
                <div className="h-24 bg-white rounded mb-1"></div>
                <div className="text-sm">{s.title}</div>
              </div>
            ))}
          </div>

          {/* Canvas area */}
          <div className="flex-1 p-4 overflow-auto">
            <div className="bg-white border rounded p-4 h-full">
              <textarea value={contentText} onChange={(e)=>{ pushUndo(contentText); setContentText(e.target.value) }} className="w-full h-full p-3 border rounded" />
            </div>
          </div>

          {/* Properties panel */}
          <div className="w-64 border-l p-3 bg-gray-50">
            <div className="mb-3 font-semibold">属性</div>
            <div className="mb-2">
              <button onClick={addTextBlock} className="w-full bg-green-500 text-white px-2 py-1 rounded">追加</button>
            </div>
            <div className="mb-2">
              <button onClick={deleteSlide} className="w-full bg-red-500 text-white px-2 py-1 rounded">削除</button>
            </div>
            <div className="mb-2">
              <label className="flex items-center gap-2"><input type="checkbox" /> チェックマーク</label>
            </div>
            <div className="mb-2">
              <label>箇条書き</label>
              <div className="mt-1 flex gap-2">
                <button className="px-2 py-1 border rounded">•</button>
                <button className="px-2 py-1 border rounded">=</button>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex items-center justify-between">
                <div>オン</div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider" />
                </label>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex items-center justify-between">
                <div>オフ</div>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {exportOpen && (
        <ExportModal open={exportOpen} onClose={()=>setExportOpen(false)} onExport={async(format)=>{ await exportSlide(format); setExportOpen(false) }} />
      )}

      <ConfirmModal open={confirmOpen} message={confirmMessage} onClose={()=>setConfirmOpen(false)} onConfirm={confirmAction} />
    </Layout>
  )
}
