import React from 'react'
import Layout from '../components/Layout'
import { useNavigate } from 'react-router-dom'

export default function Dashboard(){
  const navigate = useNavigate()

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
      </div>
    </Layout>
  )
}
