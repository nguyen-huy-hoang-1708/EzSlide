import React, { useEffect, useRef, useState } from 'react'

export default function Timer({ autoStart=false }){
  const [running, setRunning] = useState(autoStart)
  const [elapsed, setElapsed] = useState(0)
  const refStart = useRef(null)

  useEffect(()=>{
    let intv
    if (running){
      refStart.current = Date.now() - elapsed
      intv = setInterval(()=>{
        setElapsed(Date.now() - refStart.current)
      }, 200)
    }
    return ()=> clearInterval(intv)
  }, [running])

  function toggle(){ setRunning(r => !r) }
  function reset(){ setRunning(false); setElapsed(0) }

  function format(ms){
    const total = Math.floor(ms/1000)
    const m = Math.floor(total/60).toString().padStart(2,'0')
    const s = (total%60).toString().padStart(2,'0')
    return `${m}:${s}`
  }

  return (
    <div className="p-4 bg-white rounded border flex flex-col items-center justify-center">
      <div className="text-sm text-gray-600 mb-2">発表者の視点</div>
      <div className="text-3xl font-mono mb-2">{format(elapsed)}</div>
      <div className="flex gap-2">
        <button onClick={toggle} className="px-3 py-1 border rounded">{running ? 'Pause' : 'Start'}</button>
        <button onClick={reset} className="px-3 py-1 border rounded">Reset</button>
      </div>
    </div>
  )
}
