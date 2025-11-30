import React from 'react'

export default function ColorSwatch({ color, selected, onClick }){
  const base = color === 'Any' ? 'border border-gray-300 bg-white' : `bg-${color}-500`
  return (
    <button onClick={()=>onClick(color)} title={color} className={`w-6 h-6 rounded ${selected ? 'ring-2 ring-black' : ''} ${base}`}></button>
  )
}
