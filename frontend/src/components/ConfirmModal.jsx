import React from 'react'
import Modal from './Modal'

export default function ConfirmModal({ open, title = 'エラー', message, onClose, onConfirm }){
  if (!open) return null
  return (
    <Modal title={title} onClose={onClose}>
      <div className="py-4 text-center">
        <div className="mb-4 text-sm text-gray-700">{message}</div>
        <div className="flex">
          <button onClick={onClose} className="flex-1 px-4 py-2 border rounded-l">いいえ</button>
          <button onClick={()=>{ onConfirm(); onClose() }} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-r">はい</button>
        </div>
      </div>
    </Modal>
  )
}
