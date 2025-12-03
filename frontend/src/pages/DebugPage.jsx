import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function DebugPage() {
  const [templates, setTemplates] = useState([])
  const [presentations, setPresentations] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      console.log('=== DEBUG: Fetching data ===')
      console.log('API Base URL:', api.defaults.baseURL)
      
      const templatesRes = await api.get('/templates')
      console.log('Templates response:', templatesRes.data)
      setTemplates(templatesRes.data)

      try {
        const presRes = await api.get('/presentations')
        console.log('Presentations response:', presRes.data)
        setPresentations(presRes.data)
      } catch (presErr) {
        console.log('Presentations error (might need login):', presErr.message)
      }
    } catch (err) {
      console.error('Error loading data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🔍 EZSlide Debug Page</h1>
      
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '8px' }}>
        <h2>Templates ({templates.length})</h2>
        {templates.length === 0 ? (
          <p style={{ color: 'orange' }}>⚠️ No templates loaded</p>
        ) : (
          <ul>
            {templates.map(t => (
              <li key={t.id}>
                <strong>{t.name}</strong> - {t.category}
                {t.thumbnail && <span> ✅ Has thumbnail</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#e0f0ff', borderRadius: '8px' }}>
        <h2>Presentations ({presentations.length})</h2>
        {presentations.length === 0 ? (
          <p style={{ color: 'orange' }}>⚠️ No presentations (need login)</p>
        ) : (
          <ul>
            {presentations.map(p => (
              <li key={p.id}><strong>{p.title}</strong></li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#fff3cd', borderRadius: '8px' }}>
        <h3>Debug Info:</h3>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
API Base URL: {api.defaults.baseURL || 'Not set'}
{'\n'}Token: {localStorage.getItem('token') ? 'Present' : 'Not logged in'}
        </pre>
      </div>
    </div>
  )
}
