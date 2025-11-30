import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Register(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    setError('')
    setPasswordError('')
    setUsernameError('')
    // Client-side validations
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setError('メールアドレスの形式が不正です')
    if (password !== confirm){ setPasswordError('パスワードが一致しません'); return }
    if (/['"]/.test(password)) return setError('パスワードに使用できない文字が含まれています')
    const groups = [(/[A-Za-z]/.test(password)), (/[0-9]/.test(password)), (/[^A-Za-z0-9]/.test(password))].filter(Boolean).length
    if (groups < 2) return setError('パスワードは英字、数字、記号のうち2種類以上を含めてください')
    if (username.length === 0) return setError('ユーザーネームを入力してください')
    if (username.length > 32) return setError('ユーザー名は32文字以内で入力してください')
    try{
      await api.post('/auth/register', { email, password, name: username })
      nav('/login')
    }catch(err){
      const msg = err?.response?.data?.message || 'Error'
      setError(msg)
      if (msg === 'ユーザー名は既に存在します'){
        setUsername('')
        setUsernameError(msg)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      <header className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">E</div>
          <div className="text-2xl font-bold text-gray-800">EzSlide</div>
        </div>
        <div>
          <Link to="/login" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors">ログイン</Link>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">アカウント作成</h2>
          <p className="text-gray-500 text-sm mb-6">新しいアカウントを作成しましょう</p>
        <form onSubmit={submit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">メールアドレス</label>
            <input placeholder="example@email.com" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">パスワード</label>
            <input placeholder="英字、数字、記号を2種以上" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">パスワード確認</label>
            <input placeholder="パスワードを再入力" type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
          </div>
          {passwordError && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">{passwordError}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">ユーザネーム</label>
            <input placeholder="ユーザネーム（32文字以内）" value={username} onChange={(e)=>setUsername(e.target.value)} className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
          </div>
          {usernameError && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">{usernameError}</div>}
          <div className="flex justify-between items-center text-sm pt-2">
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">すでにアカウントをお持ちですか? ログイン</Link>
            <button type="submit" className="bg-indigo-600 text-white py-2.5 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg">登録</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  )
}
