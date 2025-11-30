import React, { useEffect, useMemo, useRef, useState } from 'react'
import ConfirmModal from '../components/ConfirmModal'
import Layout from '../components/Layout'
import FilterPanel from '../components/FilterPanel'
import AssetCard from '../components/AssetCard'
import client from '../services/api'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export default function Assets(){
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()

  const [tempCategory, setTempCategory] = useState('All')
  const [tempStyle, setTempStyle] = useState('All')
  const [tempColor, setTempColor] = useState('Any')
  const [category, setCategory] = useState('All')
  const [style, setStyle] = useState('All')
  const [color, setColor] = useState('Any')

  const categories = ['All','Photos','Icons','Backgrounds','Illustrations']
  const styles = ['All','Flat','Minimal','Abstract']
  const colors = ['Any','blue','red','green','purple']

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState('')
  const [confirmAction, setConfirmAction] = useState(()=>()=>{})

  useEffect(()=>{
    fetchAssets()
  },[])

  async function fetchAssets(){
    setLoading(true)
    try{
      const res = await client.get('/assets')
      setAssets(res.data.map(a => ({...a, _meta: mapAssetMeta(a)})))
    }catch(err){
      console.error(err)
    }finally{setLoading(false)}
  }

  function mapAssetMeta(asset){
    const fn = asset.filename?.toLowerCase() || ''
    let c = 'Illustrations'
    if (/logo|icon/.test(fn)) c = 'Icons'
    if (/bg|background|backdrop/.test(fn)) c = 'Backgrounds'
    if (/jpg|jpeg|png|gif/.test(fn)) c = 'Photos'
    let style = 'Abstract'
    if (/flat/.test(fn)) style = 'Flat'
    if (/minimal/.test(fn)) style = 'Minimal'
    let color = 'Any'
    if (/blue/.test(fn)) color = 'blue'
    if (/red/.test(fn)) color = 'red'
    if (/green/.test(fn)) color = 'green'
    return { category: c, style, color }
  }

  const filtered = useMemo(()=>{
    return assets.filter(a => {
      if (category !== 'All' && a._meta?.category !== category) return false
      if (style !== 'All' && a._meta?.style !== style) return false
      if (color !== 'Any' && a._meta?.color !== color) return false
      return true
    })
  }, [assets, category, style, color])

  function onApply(){
    setCategory(tempCategory)
    setStyle(tempStyle)
    setColor(tempColor)
  }
  function onReset(){
    setTempCategory('All')
    setTempStyle('All')
    setTempColor('Any')
    setCategory('All')
    setStyle('All')
    setColor('Any')
  }

  async function onPickFile(e){
    const file = e.target.files?.[0]
    if(!file) return
    const form = new FormData()
    form.append('file', file)
    try{
      const res = await client.post('/assets/upload', form)
      setAssets(prev => [res.data, ...prev])
    }catch(err){
      console.error(err)
    }
  }

  function onUploadClick(){
    fileRef.current?.click()
  }

  function onDownload(asset){
    const link = document.createElement('a')
    link.href = asset.url?.startsWith('http') ? asset.url : `${API_BASE}${asset.url}`
    link.download = asset.filename
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  async function onDelete(asset){
    setConfirmMessage(`Delete ${asset.filename}?`)
    setConfirmAction(()=>async ()=>{
      try{
        await client.delete(`/assets/${asset.id}`)
        setAssets(prev => prev.filter(a => a.id !== asset.id))
      }catch(err){
        console.error(err)
        alert('Could not delete asset')
      }
    })
    setConfirmOpen(true)
  }

  return (
    <Layout>
      <div className="flex gap-6">
        <FilterPanel
          categories={categories}
          styles={styles}
          colors={colors}
          tempCategory={tempCategory}
          tempStyle={tempStyle}
          tempColor={tempColor}
          setTempCategory={setTempCategory}
          setTempStyle={setTempStyle}
          setTempColor={setTempColor}
          onApply={onApply}
          onReset={onReset}
        />
        <div className="flex-1">
          <div className="flex items-center mb-4 justify-between">
            <h2 className="font-semibold">アセット</h2>
            <div className="flex gap-2">
              <input ref={fileRef} type="file" className="hidden" onChange={onPickFile} />
              <button onClick={onUploadClick} className="px-3 py-1 border rounded">アップロード</button>
              <button onClick={()=>{}} className="px-3 py-1 border rounded">追加</button>
            </div>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {filtered.length === 0 ? (
                <div className="text-gray-500">No assets</div>
              ) : (
                filtered.map(asset => (
                  <AssetCard key={asset.id} asset={asset} onDelete={onDelete} onDownload={onDownload} />
                ))
              )}
            </div>
          )}
        </div>
        <ConfirmModal open={confirmOpen} message={confirmMessage} onClose={()=>setConfirmOpen(false)} onConfirm={confirmAction} />
      </div>
    </Layout>
  )
}
