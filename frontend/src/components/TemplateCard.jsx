import React from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function TemplateCard({ template }){
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)

  async function handleUseTemplate(e) {
    e.stopPropagation()
    setLoading(true)
    try {
      const response = await api.post(`/templates/${template.id}/use`, {
        title: `My ${template.name}`
      })
      
      // Navigate to the first slide of the new presentation
      if (response.data.slides && response.data.slides.length > 0) {
        navigate(`/editor/${response.data.slides[0].id}`)
      } else {
        navigate(`/presentations/${response.data.id}`)
      }
    } catch (error) {
      console.error('Failed to use template:', error)
      alert('Failed to create presentation from template')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-xl transition-all overflow-hidden group">
      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden relative">
        {template.thumbnail ? (
          <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-500">No Preview</span>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
          <button
            onClick={handleUseTemplate}
            disabled={loading}
            className="opacity-0 group-hover:opacity-100 transition-opacity px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Use Template'}
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="text-lg font-semibold text-gray-900 mb-1">{template.name}</div>
        <div className="text-sm text-gray-500">{template.category}</div>
      </div>
    </div>
  )
}

