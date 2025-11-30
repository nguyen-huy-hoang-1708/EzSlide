import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'
import { Link, useNavigate } from 'react-router-dom'

export default function Presentations(){
  const [presentations, setPresentations] = useState([])
  const [title, setTitle] = useState('')
  const nav = useNavigate()

  useEffect(()=>{ async function load(){ try{ const res = await api.get('/presentations'); setPresentations(res.data)}catch(e){}}; load() },[])

  async function create(){
    if(!title) return
    try{
      const res = await api.post('/presentations', { title })
      setPresentations(p => [res.data, ...p])
      setTitle('')
      nav(`/presentations/${res.data.id}`)
    }catch(err){ console.error(err) }
  }

  return (
    <Layout>
      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Presentations</h2>
          <div className="flex gap-2">
            <input placeholder="New presentation title" value={title} onChange={(e)=>setTitle(e.target.value)} className="border p-2 rounded" />
            <button onClick={create} className="px-3 py-1 bg-blue-500 text-white rounded">Create</button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {presentations.map(p => (
            <div key={p.id} className="p-3 border rounded bg-gray-50">
              <div className="font-semibold mb-2">{p.title}</div>
              <Link to={`/presentations/${p.id}`} className="text-sm text-blue-500">Open</Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
