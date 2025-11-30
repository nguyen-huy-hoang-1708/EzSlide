import React from 'react'

export default function FilterPanel({ tempCategory, setTempCategory, tempStyle, setTempStyle, tempColor, setTempColor, categories, styles, colors, onApply, onReset }){
  return (
    <aside className="w-72 border p-4 rounded bg-white shadow-sm">
      <h3 className="font-semibold mb-3">フィルター</h3>
      <div className="mb-4">
        <label className="block text-sm mb-1">カテゴリ</label>
        <select className="w-full border p-2 rounded" value={tempCategory} onChange={(e)=>setTempCategory(e.target.value)}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm mb-1">色彩</label>
        <div className="flex items-center gap-2">
          {colors.map(c => (
            <button key={c} onClick={()=>setTempColor(c)} title={c} className={`w-6 h-6 rounded ${c === 'blue' ? 'bg-blue-500' : ''} ${c === 'green' ? 'bg-green-500' : ''} ${c === 'red' ? 'bg-red-500' : ''} ${c === 'purple' ? 'bg-purple-500' : ''} ${c === 'Any' ? 'border border-gray-300' : ''} ${c === tempColor ? 'ring-2 ring-black' : ''}`}></button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm mb-1">スタイル</label>
        <select className="w-full border p-2 rounded" value={tempStyle} onChange={(e)=>setTempStyle(e.target.value)}>
          {styles.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="flex gap-2 mt-4">
        <button onClick={onApply} className="bg-green-500 text-white px-4 py-2 rounded">適用</button>
        <button onClick={onReset} className="px-4 py-2 border rounded">リセット</button>
      </div>
    </aside>
  )
}
