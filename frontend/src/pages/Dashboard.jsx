import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Dashboard(){
  const navigate = useNavigate()
  const [presentations, setPresentations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPresentations()
  }, [])

  async function loadPresentations() {
    try {
      const res = await api.get('/presentations')
      // Sort by updatedAt descending and take first 6
      const sorted = res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      setPresentations(sorted.slice(0, 6))
    } catch (err) {
      console.error('Failed to load presentations:', err)
    } finally {
      setLoading(false)
    }
  }

  function createNew(){
    navigate('/editor/new')
  }

  return (
    <Layout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ダッシュボード</h1>
          <p className="text-gray-600">新しいスライドを作成するか、最近のプロジェクトを続けてください</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group" onClick={createNew}>
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl mb-3 group-hover:scale-110 transition-transform">+</div>
            <div className="font-semibold text-gray-700 group-hover:text-indigo-600">新規スライド</div>
            <div className="text-xs text-gray-500 mt-1">空白から作成</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-all text-white" onClick={()=>navigate('/ai')}>
            <div className="text-5xl mb-3">✨</div>
            <div className="font-bold text-lg">AIで作成</div>
            <div className="text-sm text-white/80 mt-1">自動生成</div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-all group" onClick={()=>navigate('/templates')}>
            <div className="w-full h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-3 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-3xl">🎨</span>
            </div>
            <div className="font-semibold text-gray-700">テンプレート</div>
            <div className="text-xs text-gray-500 mt-1">プロのデザイン</div>
          </div>
        </div>

        {/* Recent Presentations */}
        {presentations.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">最近のプレゼンテーション</h2>
              <button 
                onClick={() => navigate('/presentations')}
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1"
              >
                すべて表示
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {presentations.map(p => (
                <div 
                  key={p.id}
                  onClick={() => {
                    const firstSlideId = p.firstSlideId || (p.slides && p.slides.length > 0 ? p.slides[0].id : null)
                    if (firstSlideId) {
                      navigate(`/editor/${firstSlideId}`)
                    }
                  }}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="h-40 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
                    {p.slides && p.slides.length > 0 ? (
                      <div 
                        className="absolute inset-0"
                        style={(() => {
                          try {
                            const content = JSON.parse(p.slides[0].content || '{}')
                            if (content.backgroundImage) {
                              return {
                                backgroundImage: `url(${content.backgroundImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }
                            }
                            return { backgroundColor: content.background || '#ffffff' }
                          } catch {
                            return { backgroundColor: '#f3f4f6' }
                          }
                        })()}
                      />
                    ) : (
                      <span className="text-5xl text-gray-300">📄</span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 truncate">{p.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{p.slideCount || p.slides?.length || 0} スライド</span>
                      <span>{new Date(p.updatedAt).toLocaleDateString('ja-JP')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-12 text-center text-gray-500">
            読み込み中...
          </div>
        )}
      </div>
    </Layout>
  )
}
