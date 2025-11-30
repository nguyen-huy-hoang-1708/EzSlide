import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function PresentationDetail(){
  const { id } = useParams()
  const [presentation, setPresentation] = useState(null)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  useEffect(()=>{
    async function load(){
      setLoading(true)
      try{
        const res = await api.get(`/presentations/${id}`)
        setPresentation(res.data)
      }catch(e){ console.error(e) }
      setLoading(false)
    }
    load()
  }, [id])

  async function addSlide(){
    try{
      const res = await api.post('/slides', { presentationId: id, title: 'Untitled', content: {} })
      nav(`/editor/${res.data.id}`)
    }catch(err){ console.error(err) }
  }

  if (loading) return <Layout><div>Loading...</div></Layout>
  if (!presentation) return <Layout><div>Presentation not found</div></Layout>

  return (
    <Layout>
      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{presentation.title}</h2>
          <div className="flex gap-2">
            <button onClick={addSlide} className="px-3 py-1 bg-green-500 text-white rounded">Add Slide</button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {presentation.slides?.map(s => (
            <div key={s.id} className="p-3 border rounded bg-gray-50 flex items-center justify-between">
              <div>{s.title || `Slide ${s.orderIndex}`}</div>
              <button onClick={()=>nav(`/editor/${s.id}`)} className="px-2 py-1 border rounded">Edit</button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
