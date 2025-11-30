import React from 'react'

export default function TemplateCard({ template, onSelect, selected }){
  return (
    <div className={`bg-white rounded shadow p-3 cursor-pointer hover:shadow-md ${selected ? 'ring-2 ring-indigo-500' : ''}`} onClick={()=>onSelect(template)}>
      <div className="h-40 bg-gray-100 rounded flex items-center justify-center mb-2">
        {/* Placeholder thumbnail */}
        <span className="text-gray-500">Thumbnail</span>
      </div>
      <div className="text-sm font-semibold">{template.name}</div>
      <div className="text-xs text-gray-500">{template.category}</div>
    </div>
  )
}
