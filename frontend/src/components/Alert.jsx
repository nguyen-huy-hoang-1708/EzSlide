import React from 'react'

export default function Alert({ type = 'error', children }){
  const base = type === 'error' ? 'bg-red-100 border-red-400 text-red-800' : 'bg-yellow-100 border-yellow-400 text-yellow-800'
  return (
    <div className={`border px-4 py-3 rounded ${base}`} role="alert">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M9 2a1 1 0 012 0v7a1 1 0 01-2 0V2zM8 15a1 1 0 011-1h0a1 1 0 011 1v0a1 1 0 01-1 1h0a1 1 0 01-1-1z"/></svg>
        <div className="text-sm">{children}</div>
      </div>
    </div>
  )
}
