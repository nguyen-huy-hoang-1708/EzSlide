import React, { useMemo, useState, useEffect } from 'react'
import Layout from '../components/Layout'
import TemplateCard from '../components/TemplateCard'
import FilterPanel from '../components/FilterPanel'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Templates(){
  const navigate = useNavigate()
  const [allTemplates, setAllTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [style, setStyle] = useState('All')
  const [color, setColor] = useState('Any')
  const [tempCategory, setTempCategory] = useState(category)
  const [tempStyle, setTempStyle] = useState(style)
  const [tempColor, setTempColor] = useState(color)

  useEffect(() => {
    fetchTemplates()
  }, [])

  async function fetchTemplates() {
    try {
      const res = await api.get('/templates')
      console.log('Fetched templates:', res.data)
      setAllTemplates(res.data)
    } catch (err) {
      console.error('Failed to fetch templates:', err)
    } finally {
      setLoading(false)
    }
  }

  const categories = useMemo(()=>['All', ...Array.from(new Set(allTemplates.map(t=>t.category)))], [allTemplates])
  const styles = useMemo(()=>['All'], [])
  const colors = useMemo(()=>['Any'], [])

  const filtered = useMemo(()=>{
    const result = allTemplates.filter(t =>
      (category === 'All' || t.category === category)
    )
    console.log('Filtered templates:', result.length, 'Category:', category)
    return result
  }, [category, allTemplates])

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

  return (
    <Layout>
      <div className="bg-white p-4 rounded shadow">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading templates...</div>
          </div>
        ) : (
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
              {filtered.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No templates found</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map(t => (
                    <TemplateCard key={t.id} template={t} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
