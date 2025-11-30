import React from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export default function AssetCard({ asset, onDownload, onDelete }){
  const src = asset.url?.startsWith('http') ? asset.url : `${API_BASE}${asset.url}`
  return (
    <div className="relative bg-white rounded shadow-sm overflow-hidden">
      <div className="h-36 bg-gray-100 flex items-center justify-center">
        {asset.url ? (
          <img src={src} alt={asset.filename} className="h-full object-contain" />
        ) : (
          <div className="text-sm text-gray-500">No preview</div>
        )}
      </div>
      <div className="p-2 flex items-center justify-between">
        <div className="text-sm truncate">{asset.filename}</div>
        <div className="flex gap-2">
          <button onClick={()=>onDownload(asset)} className="px-2 py-1 text-xs border rounded">DL</button>
          <button onClick={()=>onDelete(asset)} className="px-2 py-1 text-xs border rounded text-red-500">Del</button>
        </div>
      </div>
    </div>
  )
}
