import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function AdminDashboard(){
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()

  useEffect(()=>{
    async function load(){
      try{
        const res = await api.get('/auth/me')
        const role = res.data?.user?.role
        if (role !== 'admin') nav('/dashboard')
      }catch(e){
        nav('/login')
      } finally { setLoading(false) }
    }
    load()
  }, [nav])
  if (loading) return null
  return (
    <Layout>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
        <p>管理者向けのダッシュボードです。ここに管理ツールを追加します。</p>
      </div>
    </Layout>
  )
}
