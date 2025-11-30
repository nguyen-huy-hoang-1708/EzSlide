import React, { useState } from 'react'
import Modal from './Modal'

export default function ExportModal({ open, onClose, onExport }){
  const [format, setFormat] = useState('pdf')
  if (!open) return null
  return (
    <Modal title="公開&共有" onClose={onClose}>
      <div className="py-4">
        <div className="mb-3">
          <label className="flex items-center gap-2"><input type="radio" name="fmt" checked={format === 'pptx'} onChange={()=>setFormat('pptx')} /> PPTX</label>
        </div>
        <div className="mb-4">
          <label className="flex items-center gap-2"><input type="radio" name="fmt" checked={format === 'pdf'} onChange={()=>setFormat('pdf')} /> PDF</label>
        </div>
        <div className="text-center">
          <button onClick={()=>onExport(format)} className="px-4 py-2 bg-blue-600 text-white rounded">ダウンロード ⬇</button>
        </div>
      </div>
    </Modal>
  )
}
