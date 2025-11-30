import React, { useMemo, useState } from 'react'
import Layout from '../components/Layout'
import TemplateCard from '../components/TemplateCard'
import FilterPanel from '../components/FilterPanel'
import { useNavigate } from 'react-router-dom'

const allTemplates = [
  { id: 1, name: 'Business Pitch', category: 'Business', color: 'blue', style: 'Corporate' },
  { id: 2, name: 'Education Lecture', category: 'Education', color: 'green', style: 'Academic' },
  { id: 3, name: 'Sales Deck', category: 'Business', color: 'red', style: 'Modern' },
  { id: 4, name: 'Workshop', category: 'Education', color: 'blue', style: 'Friendly' },
  { id: 5, name: 'Project Proposal', category: 'Business', color: 'purple', style: 'Corporate' },
  { id: 6, name: 'Case Study', category: 'Business', color: 'green', style: 'Modern' }
]

export default function Templates(){
  const navigate = useNavigate()
  const [category, setCategory] = useState('All')
  const [style, setStyle] = useState('All')
  const [color, setColor] = useState('Any')
  const [tempCategory, setTempCategory] = useState(category)
  const [tempStyle, setTempStyle] = useState(style)
  const [tempColor, setTempColor] = useState(color)

  const categories = useMemo(()=>['All', ...Array.from(new Set(allTemplates.map(t=>t.category)))], [])
  const styles = useMemo(()=>['All', ...Array.from(new Set(allTemplates.map(t=>t.style)))], [])
  const colors = useMemo(()=>['Any', ...Array.from(new Set(allTemplates.map(t=>t.color)))], [])

  const filtered = useMemo(()=>{
    return allTemplates.filter(t =>
      (category === 'All' || t.category === category) &&
      (style === 'All' || t.style === style) &&
      (color === 'Any' || t.color === color)
    )
  }, [category, style, color])

  function onApply(){
    setCategory(tempCategory)
    setStyle(tempStyle)
    setColor(tempColor)
  }

  function onReset(){
    setTempCategory('All')
    setTempStyle('All')
    setTempColor('Any')
    onApply()
  }

  // (onApply replaced earlier to apply temp filters)

  const [selected, setSelected] = useState(null)
  function openTemplate(template){
    setSelected(template.id)
    navigate(`/editor/new`, { state: { templateId: template.id } })
  }

  return (
    <Layout>
      <div className="bg-white p-4 rounded shadow">
        <div className="flex gap-4">
          {/* Filter column */}
          <FilterPanel
            tempCategory={tempCategory}
            setTempCategory={setTempCategory}
            tempStyle={tempStyle}
            setTempStyle={setTempStyle}
            tempColor={tempColor}
            setTempColor={setTempColor}
            categories={categories}
            styles={styles}
            colors={colors}
            onApply={onApply}
            onReset={onReset}
          />
          {/* Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-3 gap-4">
              {filtered.map(t => (
                <TemplateCard key={t.id} template={t} onSelect={openTemplate} selected={selected === t.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
