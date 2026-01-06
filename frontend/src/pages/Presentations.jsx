import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'

export default function Presentations(){
  const [presentations, setPresentations] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [title, setTitle] = useState('')
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null, confirmText: 'OK' })
  const nav = useNavigate()
  const { showToast } = useToast()

  useEffect(() => { 
    loadPresentations()
  }, [])

  async function loadPresentations() {
    try { 
      const res = await api.get('/presentations')
      console.log('Loaded presentations:', res.data)
      console.log('User from localStorage:', localStorage.getItem('user'))
      setPresentations(res.data)
    } catch(e) {
      console.error('Failed to load presentations:', e)
    } finally {
      setLoading(false)
    }
  }

  async function create(){
    if(!title.trim()) {
      showToast('プレゼンテーションのタイトルを入力してください。', 'warning')
      return
    }
    
    setCreating(true)
    try{
      const res = await api.post('/presentations', { title })
      setPresentations(p => [res.data, ...p])
      setTitle('')
      
      // Create first slide and navigate to it
      const slideRes = await api.post('/slides', {
        title: 'スライド 1',
        content: { background: '#ffffff' },
        presentationId: res.data.id,
        orderIndex: 0
      })
      nav(`/editor/${slideRes.data.id}`)
    }catch(err){ 
      console.error(err)
      showToast('プレゼンテーションの作成に失敗しました。', 'error')
    } finally {
      setCreating(false)
    }
  }

  async function deletePresentation(id, e) {
    e.stopPropagation()
    setConfirmDialog({
      isOpen: true,
      title: 'プレゼンテーション削除',
      message: 'このプレゼンテーションを削除しますか？',
      confirmText: '削除',
      onConfirm: async () => {
        try {
          await api.delete(`/presentations/${id}`)
          setPresentations(presentations.filter(p => p.id !== id))
          showToast('プレゼンテーションを削除しました。', 'success')
        } catch (err) {
          console.error('Failed to delete:', err)
          showToast('プレゼンテーションの削除に失敗しました。', 'error')
        }
      }
    })
  }

  function openPresentation(p) {
    if (p.firstSlideId) {
      nav(`/editor/${p.firstSlideId}`)
    } else {
      showToast('このプレゼンテーションにはスライドがありません。', 'warning')
    }
  }

  return (
    <Layout>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
      />

      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">マイプレゼンテーション</h2>
            <p className="text-sm text-gray-500 mt-1">
              ログイン中: {JSON.parse(localStorage.getItem('user') || '{}').username || 'Unknown'}
            </p>
          </div>
          <div className="flex gap-2">
            <input 
              placeholder="新しいプレゼンテーションのタイトル" 
              value={title} 
              onChange={(e)=>setTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !creating && create()}
              disabled={creating}
              className="border px-3 py-2 rounded-lg w-64 focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed" 
            />
            <button 
              onClick={create} 
              disabled={creating}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {creating ? '作成中...' : '+ 新規プレゼンテーション'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">読み込み中...</div>
        ) : presentations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">まだプレゼンテーションがありません</p>
            <p className="text-sm text-gray-500">最初のプレゼンテーションを作成するか、テンプレートを使用してください</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {presentations.map(p => (
              <div 
                key={p.id} 
                className="group border-2 border-gray-200 rounded-lg overflow-hidden hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer bg-white"
                onClick={() => openPresentation(p)}
              >
                {/* Thumbnail */}
                <div 
                  className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                  style={{
                    background: p.thumbnail?.startsWith('http') 
                      ? `url(${p.thumbnail})` 
                      : p.thumbnail || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {!p.thumbnail?.startsWith('http') && (
                    <div className="text-white text-4xl font-bold opacity-20">
                      {p.title.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 truncate group-hover:text-indigo-600">
                    {p.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{p.slideCount || 0} スライド</span>
                    <span>{new Date(p.updatedAt).toLocaleDateString()}</span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openPresentation(p)
                      }}
                      className="flex-1 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                    >
                      開く
                    </button>
                    <button
                      onClick={(e) => deletePresentation(p.id, e)}
                      className="px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
       
