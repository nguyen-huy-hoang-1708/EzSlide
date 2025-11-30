import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'
import ConfirmModal from '../components/ConfirmModal'

export default function AdminUsers(){
  const [users, setUsers] = useState([])

  useEffect(()=>{ async function load(){ try{ const res = await api.get('/users'); setUsers(res.data) }catch(e){ console.error(e) } }; load() },[])

  async function changeRole(userId, role){
    try{
      const res = await api.put(`/users/${userId}`, { role })
      setUsers(u => u.map(x => x.id === userId ? res.data : x))
    }catch(err){ console.error(err) }
  }

  async function deleteUser(userId){
    try{
      await api.delete(`/users/${userId}`)
      setUsers(u => u.filter(x => x.id !== userId))
    }catch(err){ console.error(err) }
  }

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [targetUser, setTargetUser] = useState(null)

  return (
    <Layout>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">ユーザー管理</h2>
        <table className="w-full">
          <thead><tr><th>ID</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.id}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <button className="px-2 py-1 border rounded" onClick={()=>changeRole(u.id, u.role === 'admin' ? 'user' : 'admin')}>Toggle Role</button>
                    <button className="px-2 py-1 border rounded text-red-600" onClick={()=>{ setTargetUser(u); setConfirmOpen(true) }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmModal open={confirmOpen} title="Delete user" message={`Delete user ${targetUser?.email}?`} onClose={()=>setConfirmOpen(false)} onConfirm={()=>deleteUser(targetUser?.id)} />
    </Layout>
  )
}
