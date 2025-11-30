import React, { useState } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'
import Alert from '../components/Alert'

export default function GenerateAI(){
  const [prompt, setPrompt] = useState('')
  const [count, setCount] = useState(3)
  const [tone, setTone] = useState('neutral')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState([])
  const [error, setError] = useState('')
  const [aiAvailable, setAiAvailable] = useState(true)

  async function run(){
    setLoading(true)
    setError('')
    try{
      const res = await api.post('/ai/generate', { prompt, count, tone })
      setResult(res.data.slides || [])
      setAiAvailable(true)
    }catch(err){
      console.error(err)
      setError('AIスライドは利用できません')
      setAiAvailable(false)
    }finally{ setLoading(false) }
  }

  return (
    <Layout>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">AIスライド</h2>
        {/* Input and generate button */}
        <div className="flex items-center gap-3 mb-4">
          <input value={prompt} onChange={(e)=>setPrompt(e.target.value)} placeholder="創りたいのか教えてください…" className="flex-1 border p-3 rounded-lg" disabled={loading || !aiAvailable} />
          <button onClick={run} className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading || !aiAvailable}>{loading ? '生成中…' : '生成'}</button>
        </div>
        {/* Controls box */}
        <div className="mx-auto max-w-xl border rounded p-4 bg-gray-50 mb-4">
          <div className="flex items-center gap-4 justify-center">
            <div className="flex items-center gap-2">
              <label className="mr-2">スライドの枚</label>
              <div className="flex items-center gap-1 border rounded">
                <button className="px-2" onClick={()=>setCount(c => Math.max(1, c-1))} aria-label="decrease">-</button>
                <input type="number" className="w-16 text-center" min={1} max={20} value={count} onChange={(e)=>setCount(Number(e.target.value))} />
                <button className="px-2" onClick={()=>setCount(c => Math.min(20, c+1))} aria-label="increase">+</button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label>トーン</label>
              <select value={tone} onChange={(e)=>setTone(e.target.value)} className="border p-2 rounded">
                <option value="neutral">中立</option>
                <option value="formal">フォーマル</option>
                <option value="friendly">フレンドリー</option>
                <option value="academic">学術</option>
              </select>
            </div>
          </div>
        </div>
        {/* Error banner */}
        {!aiAvailable && (
          <div className="mb-4">
            <Alert type="error">AIスライドは利用できません</Alert>
          </div>
        )}
        <div className="flex gap-2 py-2 items-center">
          <label>Số lượng:</label>
          <input type="number" min={1} max={10} value={count} onChange={(e)=>setCount(Number(e.target.value))} className="border p-1 w-20 rounded" />
          <label>Tone:</label>
          <select value={tone} onChange={(e)=>setTone(e.target.value)} className="border p-1 rounded">
            <option value="neutral">Trung tính</option>
            <option value="formal">Trang trọng</option>
            <option value="friendly">Thân thiện</option>
          </select>
          <button onClick={run} className="ml-auto bg-indigo-500 text-white px-3 py-1 rounded">{loading ? 'Đang chạy…' : 'Tạo'}</button>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {result.map((s, i) => (
            <div className="p-3 border bg-gray-50 rounded" key={i}>
              <h4 className="font-semibold">{s.title}</h4>
              <p className="text-sm">{JSON.parse(s.content).text}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
