import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Dashboard(){
  const [recent, setRecent] = useState([])
  const navigate = useNavigate()

  useEffect(()=>{
    async function load(){
      try{
        const res = await api.get('/slides')
        setRecent(res.data || [])
      }catch(err){
        console.error('Cannot fetch slides', err)
      }
    }
    load()
  }, [])

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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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

        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">最近作成</h3>
          <button onClick={()=>navigate('/slides')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">すべて表示 →</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recent.length === 0 && (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <div className="text-4xl mb-3">📋</div>
              <div className="text-gray-500">最近作成したスライドはありません</div>
              <button onClick={createNew} className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium">今すぐ作成</button>
            </div>
          )}
          {recent.map(s => (
            <div key={s.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all group" onClick={()=>navigate(`/editor/${s.id}`)}>
              <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-b group-hover:from-indigo-50 group-hover:to-purple-50 transition-colors">
                <span className="text-5xl opacity-30">📄</span>
              </div>
              <div className="p-4">
                <div className="font-semibold text-gray-800 truncate">{s.title}</div>
                <div className="text-xs text-gray-500 mt-1">スライド</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
