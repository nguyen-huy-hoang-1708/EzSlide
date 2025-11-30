import React, { useEffect, useState } from 'react'
import ConfirmModal from '../components/ConfirmModal'
import Layout from '../components/Layout'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function SlidesList(){
  const [slides, setSlides] = useState([])
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('All')
  const [message, setMessage] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState(()=>()=>{})
  const [confirmMessage, setConfirmMessage] = useState('')

  useEffect(()=>{
    async function load(){
      try{
        const res = await api.get('/slides')
        setSlides(res.data || [])
      }catch(err){ console.error('Error fetching slides', err) }
    }
    load()
  }, [])

  const filtered = slides.filter(s => (filter === 'All' || s.category === filter) && (!q || s.title.toLowerCase().includes(q.toLowerCase())))

  async function handleDownload(id, title){
    try{
      const res = await api.get(`/slides/${id}/export?format=pdf`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `${title || 'slide'}-${id}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    }catch(err){ console.error('download failed', err)}
  }

  function handleShare(id){
    const link = `${window.location.origin}/editor/${id}`
    navigator.clipboard.writeText(link).then(()=> setMessage('Link copied to clipboard'))
  }

  async function handleDelete(id){
    setConfirmMessage('このスライドを削除しますか？')
    setConfirmAction(()=>async ()=>{
      try{
        await api.delete(`/slides/${id}`)
        setSlides(s => s.filter(x => x.id !== id))
        setMessage('Slide deleted')
      }catch(err){ console.error(err) }
    })
    setConfirmOpen(true)
  }

  return (
    <Layout>
      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-center gap-3 mb-4">
          <select value={filter} onChange={(e)=>setFilter(e.target.value)} className="border p-2 rounded">
            <option value="All">すべて</option>
            <option value="Business">Business</option>
            <option value="Education">Education</option>
          </select>
          <input placeholder="キーワードから探す" value={q} onChange={(e)=>setQ(e.target.value)} className="border p-2 rounded flex-1" />
          <button className="px-3 py-1 border rounded" onClick={()=>document.getElementById('upload')?.click()}>ブラウズ</button>
          <input id="upload" type="file" className="hidden" />
        </div>

        {message && <div className="mb-3 text-sm text-green-600">{message}</div>}

        <div>
          <h2 className="font-semibold mb-3">スライド</h2>
          <div className="space-y-3">
            {filtered.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 border rounded" role="listitem">
                <div>{s.title}</div>
                <div className="flex gap-2">
                  <button className="px-2 py-1 border rounded" title="Share" onClick={()=>handleShare(s.id)}>共有</button>
                  <Link to={`/editor/${s.id}`} className="px-2 py-1 border rounded">編集</Link>
                  <button className="px-2 py-1 border rounded" title="Download" onClick={()=>handleDownload(s.id, s.title)}>DL</button>
                  <button className="px-2 py-1 border rounded text-red-500" title="Delete" onClick={()=>handleDelete(s.id)}>削除</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ConfirmModal open={confirmOpen} message={confirmMessage} onClose={()=>setConfirmOpen(false)} onConfirm={confirmAction} />
    </Layout>
  )
}
