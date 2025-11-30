import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { logout } from '../services/auth'

export default function Topbar(){
  const [user, setUser] = useState(null)
  useEffect(()=>{
    async function load(){
      try{ const res = await api.get('/auth/me'); setUser(res.data.user) } catch(err){ /* ignore */ }
    }
    load()
  }, [])
  return (
    <header className="w-full h-16 bg-white flex items-center px-6 border-b shadow-sm">
      <div className="flex-1 flex items-center gap-4">
        <div className="text-lg font-semibold text-gray-800">Dashboard</div>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/ai" className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-md transition-shadow">
          <span>✨</span>
          <span>AIで作成</span>
        </Link>
        <Link to="/editor/new" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
          <span>➕</span>
          <span>新規スライド</span>
        </Link>
        <div className="flex items-center gap-3 ml-3 pl-3 border-l">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm" title="User">{(user?.name || 'U').charAt(0).toUpperCase()}</div>
            <div className="text-sm font-medium text-gray-700">{user?.name || 'User'}</div>
          </div>
          <button className="text-sm text-gray-500 hover:text-red-600 transition-colors" onClick={logout}>ログアウト</button>
        </div>
      </div>
    </header>
  )
}
