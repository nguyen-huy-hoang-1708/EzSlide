import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    // Client-side validation
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setError('メールアドレスの形式が不正です')
    if (/["']/.test(password)) return setError('メールアドレスまたはパスワードが誤っています')
    try{
      const res = await api.post('/auth/login', { email, password })
      const token = res.data.token
      localStorage.setItem('token', token)
      const home = res.data.homeUrl || '/dashboard'
      nav(home)
    }catch(err){
      setError(err?.response?.data?.message || 'Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      {/* Top header */}
      <header className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">E</div>
          <div className="text-2xl font-bold text-gray-800">EzSlide</div>
        </div>
        <div>
          <Link to="/register" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors">登録</Link>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        
        <h2 className="text-2xl font-bold mb-2 text-gray-800">アカウントログイン</h2>
        <p className="text-gray-500 text-sm mb-6">アカウントにログインしてください</p>
        <form onSubmit={submit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">メールアドレス</label>
            <input placeholder="example@email.com" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">パスワード</label>
            <input placeholder="パスワードを入力" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
          </div>
          <div className="flex justify-between items-center text-sm">
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">新規登録</Link>
            <Link to="/reset-password" className="text-gray-500 hover:text-gray-700">パスワードを忘れた?</Link>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg">ログイン</button>
        </form>
      </div>
    </div>
  </div>
  )
}
