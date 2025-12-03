import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function SlidesList(){
  const [templates, setTemplates] = useState([])
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(()=>{
    async function load(){
      try{
        const res = await api.get('/templates')
        setTemplates(res.data || [])
      }catch(err){ console.error('Error fetching templates', err) }
    }
    load()
  }, [])

  const filtered = templates.filter(t => 
    (filter === 'All' || t.category === filter) && 
    (!q || t.name.toLowerCase().includes(q.toLowerCase()))
  )

  async function handleUseTemplate(templateId, templateName) {
    setLoading(true)
    try {
      const response = await api.post(`/templates/${templateId}/use`, {
        title: `My ${templateName}`
      })
      
      if (response.data.slides && response.data.slides.length > 0) {
        navigate(`/editor/${response.data.slides[0].id}`)
      } else {
        navigate(`/presentations/${response.data.id}`)
      }
    } catch (error) {
      console.error('Failed to use template:', error)
      alert('Failed to create presentation from template')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-3 mb-6">
          <select 
            value={filter} 
            onChange={(e)=>setFilter(e.target.value)} 
            className="border p-2 rounded-lg"
          >
            <option value="All">すべて</option>
            <option value="Business">Business</option>
            <option value="Education">Education</option>
            <option value="Marketing">Marketing</option>
          </select>
          <input 
            placeholder="キーワードから探す" 
            value={q} 
            onChange={(e)=>setQ(e.target.value)} 
            className="border p-2 rounded-lg flex-1" 
          />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">テンプレート</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                テンプレートが見つかりません
              </div>
            )}
            {filtered.map(t => (
              <div 
                key={t.id} 
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
              >
                <div 
                  className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden"
                  style={{
                    backgroundImage: t.thumbnail ? `url(${t.thumbnail})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <button
                      onClick={() => handleUseTemplate(t.id, t.name)}
                      disabled={loading}
                      className="opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {loading ? '作成中...' : 'このテンプレートを使用'}
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-semibold text-gray-800 mb-1">{t.name}</div>
                  <div className="text-xs text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded">{t.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
