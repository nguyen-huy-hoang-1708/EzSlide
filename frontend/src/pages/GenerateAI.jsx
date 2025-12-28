import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'
import Alert from '../components/Alert'

export default function GenerateAI(){
  const [topic, setTopic] = useState('')
  const [count, setCount] = useState(5)
  const [tone, setTone] = useState('professional')
  const [language, setLanguage] = useState('vi')
  const [exportFormat, setExportFormat] = useState('pptx')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [aiAvailable, setAiAvailable] = useState(true)
  const [ollamaStatus, setOllamaStatus] = useState(null)

  // Check Ollama health on mount
  useEffect(() => {
    checkHealth()
  }, [])

  async function checkHealth() {
    try {
      const res = await api.get('/ai/health')
      setOllamaStatus(res.data)
      setAiAvailable(res.data.status === 'healthy')
    } catch (err) {
      console.error('Health check failed:', err)
      setOllamaStatus({ status: 'unhealthy' })
      setAiAvailable(false)
    }
  }

  async function run(){
    if (!topic.trim()) {
      setError('Vui lòng nhập chủ đề!')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')
    setResult(null)
    
    try{
      const res = await api.post('/ai/generate-slides', { 
        topic: topic.trim(),
        slideCount: count,
        tone,
        language,
        includeImages: false,
        exportFormat
      })
      
      if (res.data.success) {
        setResult(res.data)
        setAiAvailable(true)
        
        // Auto download if PPTX
        if (exportFormat === 'pptx' && res.data.file) {
          setSuccess(`✅ Slides đã được tạo thành công! File: ${res.data.file.filename}`)
          // Auto download
          const downloadUrl = `${api.defaults.baseURL}${res.data.file.downloadUrl}`
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = res.data.file.filename
          link.click()
        } else {
          setSuccess('✅ Slide plans đã được tạo thành công!')
        }
      }
    }catch(err){
      console.error(err)
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message
      const statusCode = err.response?.status
      
      // Handle 401 Unauthorized - JWT expired or invalid
      if (statusCode === 401 || errorMsg.includes('token') || errorMsg.includes('Unauthorized')) {
        setError(`❌ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.`)
        // Redirect to login after 2 seconds
        setTimeout(() => {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }, 2000)
      } else {
        setError(`❌ Lỗi: ${errorMsg}`)
        
        if (errorMsg.includes('Ollama') || errorMsg.includes('model')) {
          setAiAvailable(false)
        }
      }
    }finally{ 
      setLoading(false) 
    }
  }

  function downloadPptx() {
    if (result?.file) {
      const downloadUrl = `${api.defaults.baseURL}${result.file.downloadUrl}`
      window.open(downloadUrl, '_blank')
    }
  }

  return (
    <Layout>
      <div className="bg-white p-6 rounded shadow max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">🤖 AIスライド</h2>
        
        {/* Ollama Status Badge */}
        {ollamaStatus && (
          <div className={`mb-4 p-3 rounded text-sm ${
            ollamaStatus.status === 'healthy' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                ollamaStatus.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              <span className="font-semibold">
                {ollamaStatus.status === 'healthy' ? '✅ Ollama is running' : '❌ Ollama is not available'}
              </span>
              {ollamaStatus.models && ollamaStatus.models.length > 0 && (
                <span className="text-xs ml-auto">Model: {ollamaStatus.models[0]}</span>
              )}
            </div>
            {ollamaStatus.status !== 'healthy' && (
              <div className="mt-2 text-xs">
                <p>💡 Make sure Ollama is running:</p>
                <code className="bg-white px-2 py-1 rounded">ollama serve</code>
              </div>
            )}
          </div>
        )}

        {/* Main Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">📝 Chủ đề Presentation *</label>
          <textarea 
            value={topic} 
            onChange={(e)=>setTopic(e.target.value)} 
            placeholder="Ví dụ: Trí tuệ nhân tạo trong giáo dục, Machine Learning cơ bản, Blockchain và ứng dụng..." 
            className="w-full border p-3 rounded-lg resize-none"
            rows={3}
            disabled={loading || !aiAvailable}
          />
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Slide Count */}
          <div>
            <label className="block text-sm font-medium mb-2">📊 Số lượng slide (2-20)</label>
            <div className="flex items-center gap-2">
              <button 
                className="px-3 py-2 border rounded hover:bg-gray-100"
                onClick={()=>setCount(c => Math.max(2, c-1))} 
                disabled={loading}
              >-</button>
              <input 
                type="number" 
                className="w-20 text-center border p-2 rounded" 
                min={2} 
                max={20} 
                value={count} 
                onChange={(e)=>setCount(Math.min(20, Math.max(2, Number(e.target.value))))}
                disabled={loading}
              />
              <button 
                className="px-3 py-2 border rounded hover:bg-gray-100"
                onClick={()=>setCount(c => Math.min(20, c+1))}
                disabled={loading}
              >+</button>
            </div>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-sm font-medium mb-2">🎭 Tone</label>
            <select 
              value={tone} 
              onChange={(e)=>setTone(e.target.value)} 
              className="w-full border p-2 rounded"
              disabled={loading}
            >
              <option value="professional">Professional</option>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
              <option value="creative">Creative</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium mb-2">🌍 Ngôn ngữ</label>
            <select 
              value={language} 
              onChange={(e)=>setLanguage(e.target.value)} 
              className="w-full border p-2 rounded"
              disabled={loading}
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium mb-2">💾 Định dạng xuất</label>
            <select 
              value={exportFormat} 
              onChange={(e)=>setExportFormat(e.target.value)} 
              className="w-full border p-2 rounded"
              disabled={loading}
            >
              <option value="pptx">📄 PowerPoint (.pptx)</option>
              <option value="json">📋 JSON Only</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button 
          onClick={run} 
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            loading || !aiAvailable
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'
          }`}
          disabled={loading || !aiAvailable}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang tạo slides... (có thể mất 10-30s)
            </span>
          ) : (
            '🚀 Tạo Slides với AI'
          )}
        </button>

        {/* Success Message */}
        {success && (
          <div className="mt-4">
            <Alert type="success">{success}</Alert>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4">
            <Alert type="error">{error}</Alert>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-xl font-bold mb-4">📊 Kết quả</h3>
            
            {/* Metadata */}
            <div className="bg-gray-50 p-4 rounded mb-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="font-semibold">Chủ đề:</span> {result.metadata.topic}</div>
                <div><span className="font-semibold">Số slide:</span> {result.metadata.slideCount}</div>
                <div><span className="font-semibold">Tone:</span> {result.metadata.tone}</div>
                <div><span className="font-semibold">Ngôn ngữ:</span> {result.metadata.language}</div>
              </div>
            </div>

            {/* Download PPTX Button */}
            {result.file && exportFormat === 'pptx' && (
              <div className="mb-4">
                <button
                  onClick={downloadPptx}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition"
                >
                  ⬇️ Tải lại file PowerPoint
                </button>
              </div>
            )}

            {/* Slides Preview */}
            <div className="space-y-3">
              {result.slides.map((slide, i) => (
                <div key={i} className="border rounded-lg p-4 bg-white hover:shadow-md transition">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                      {slide.slideNumber}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-2">{slide.title}</h4>
                      {slide.bullets && slide.bullets.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                          {slide.bullets.map((bullet, j) => (
                            <li key={j}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                      {slide.notes && (
                        <div className="mt-2 text-xs text-gray-500 italic">
                          <span className="font-semibold">Notes:</span> {slide.notes}
                        </div>
                      )}
                      {slide.imageHint && (
                        <div className="mt-2 text-xs text-blue-600">
                          🖼️ {slide.imageHint}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* JSON View (if JSON export) */}
            {exportFormat === 'json' && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(result.slides, null, 2)], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = `slides_${Date.now()}.json`
                    link.click()
                  }}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold"
                >
                  💾 Tải JSON
                </button>
              </div>
            )}
          </div>
        )}

        {/* Help Text */}
        {!aiAvailable && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <p className="font-semibold mb-2">⚠️ Ollama chưa sẵn sàng</p>
            <p className="mb-2">Để sử dụng tính năng này, bạn cần:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Cài đặt Ollama: <code className="bg-white px-1 py-0.5 rounded">brew install ollama</code></li>
              <li>Khởi động service: <code className="bg-white px-1 py-0.5 rounded">ollama serve</code></li>
              <li>Pull model: <code className="bg-white px-1 py-0.5 rounded">ollama pull llama3.2</code></li>
              <li>Reload trang này</li>
            </ol>
          </div>
        )}
      </div>
    </Layout>
  )
}
