import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { logout } from '../services/auth'
import api from '../services/api'

export default function Settings(){
  const [tab, setTab] = useState('info')
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(()=>{
    async function load(){
      try{
        const res = await api.get('/auth/me')
        setUser(res.data.user)
        setName(res.data.user.name)
        setEmail(res.data.user.email)
      }catch(err){ console.error(err) }
    }
    load()
  }, [])

  async function saveInfo(){
    try{
      const res = await api.put('/auth/me', { name, email })
      setUser(res.data.user)
      setMessage('アカウント情報を更新しました')
    }catch(err){ setMessage(err?.response?.data?.message || 'Error') }
  }

  async function changePassword(){
    setMessage('')
    if (newPassword !== confirmPassword) return setMessage('Passwords do not match')
    try{
      await api.put('/auth/me', { currentPassword, password: newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setMessage('パスワードを更新しました')
    }catch(err){ setMessage(err?.response?.data?.message || 'Error') }
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">アカウント情報</h1>
          <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">ログアウト</button>
        </div>
        <div className="flex gap-4">
          <aside className="w-64">
            <nav className="flex flex-col gap-2">
              <button className={`p-2 text-left rounded ${tab==='info' ? 'bg-gray-100' : ''}`} onClick={()=>setTab('info')}>情報</button>
              <button className={`p-2 text-left rounded ${tab==='security' ? 'bg-gray-100' : ''}`} onClick={()=>setTab('security')}>セキュリティ</button>
              <button className={`p-2 text-left rounded ${tab==='payment' ? 'bg-gray-100' : ''}`} onClick={()=>setTab('payment')}>支払い</button>
              <button className={`p-2 text-left rounded ${tab==='assets' ? 'bg-gray-100' : ''}`} onClick={()=>setTab('assets')}>アセット</button>
            </nav>
          </aside>
          <main className="flex-1 bg-white p-6 rounded shadow">
            {message && <div className="mb-3 text-sm text-green-600">{message}</div>}

            {tab === 'info' && (
              <div>
                <div className="mb-3">
                  <label className="block mb-1">名前</label>
                  <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full border p-2 rounded" />
                </div>
                <div className="mb-3">
                  <label className="block mb-1">メール</label>
                  <input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full border p-2 rounded" />
                </div>
                <div className="flex justify-end">
                  <button onClick={saveInfo} className="bg-green-500 text-white px-4 py-2 rounded">保存</button>
                </div>
              </div>
            )}

            {tab === 'security' && (
              <div>
                <div className="mb-3">
                  <label className="block mb-1">現在のパスワード</label>
                  <input type="password" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} className="w-full border p-2 rounded" />
                </div>
                <div className="mb-3">
                  <label className="block mb-1">新しいパスワード</label>
                  <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} className="w-full border p-2 rounded" />
                </div>
                <div className="mb-3">
                  <label className="block mb-1">パスワードの確認</label>
                  <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} className="w-full border p-2 rounded" />
                </div>
                <div className="flex justify-end">
                  <button onClick={changePassword} className="bg-green-500 text-white px-4 py-2 rounded">保存</button>
                </div>
              </div>
            )}

            {tab === 'payment' && (
              <div>支払い情報 — (placeholder)</div>
            )}

            {tab === 'assets' && (
              <div>アセット — (placeholder)</div>
            )}

          </main>
        </div>
      </div>
    </Layout>
  )
}
