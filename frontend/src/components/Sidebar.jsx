import React, { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import api from '../services/api'

export default function Sidebar() {
  const [user, setUser] = useState(null)

  useEffect(()=>{
    async function load(){
      const token = localStorage.getItem('token')
      if (!token) return setUser(null)
      try{
        const res = await api.get('/auth/me')
        setUser(res.data.user)
      }catch(err){
        setUser(null)
      }
    }
    load()
  }, [])

  return (
    <aside className="w-64 bg-white h-full border-r flex flex-col shadow-sm">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">E</div>
          <div className="text-xl font-bold text-gray-800">EzSlide</div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <NavLink to="/dashboard" className={({isActive}) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50'}>
          <span className="text-lg">📊</span>
          <span>ダッシュボード</span>
        </NavLink>
        <NavLink to="/slides" className={({isActive}) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50'}>
          <span className="text-lg">📄</span>
          <span>スライド</span>
        </NavLink>
        <NavLink to="/templates" className={({isActive}) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50'}>
          <span className="text-lg">🎨</span>
          <span>テンプレート</span>
        </NavLink>
        <NavLink to="/assets" className={({isActive}) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50'}>
          <span className="text-lg">🖼️</span>
          <span>アセット</span>
        </NavLink>
        <NavLink to="/presentations" className={({isActive}) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50'}>
          <span className="text-lg">🎬</span>
          <span>プレゼンテーション</span>
        </NavLink>
        {user?.role === 'admin' && (
          <>
            <div className="border-t my-2 pt-2"></div>
            <NavLink to="/admin" className={({isActive}) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50'}>
              <span className="text-lg">⚙️</span>
              <span>管理</span>
            </NavLink>
            <NavLink to="/admin/users" className={({isActive}) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50'}>
              <span className="text-lg">👥</span>
              <span>ユーザー管理</span>
            </NavLink>
          </>
        )}
      </nav>
      <div className="p-4 border-t">
        {user ? (
          <Link to="/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold">{(user.name || user.email).charAt(0).toUpperCase()}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{user.name || user.email}</div>
              <div className="text-xs text-gray-500">設定を表示</div>
            </div>
          </Link>
        ) : (
          <div>
            <Link to="/login" className="block bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-center font-medium hover:bg-indigo-700 transition-colors">ログイン</Link>
          </div>
        )}
      </div>
    </aside>
  )
}
