#!/usr/bin/env node

/**
 * Script để test Ollama service và generate slides
 * Run: node src/scripts/test_ollama.js
 */

import ollamaService from '../services/ollamaService.js'
import pptxService from '../services/pptxService.js'

async function testOllama() {
  console.log('🔍 Testing Ollama Integration...\n')

  // 1. Health check
  console.log('1️⃣ Checking Ollama health...')
  try {
    const health = await ollamaService.healthCheck()
    if (health.status === 'healthy') {
      console.log('✅ Ollama is healthy!')
      console.log('📦 Available models:', health.models.join(', '))
    } else {
      console.log('❌ Ollama is not healthy:', health.error)
      console.log('\n💡 Make sure Ollama is running:')
      console.log('   ollama serve')
      return
    }
  } catch (error) {
    console.error('❌ Cannot connect to Ollama:', error.message)
    console.log('\n💡 Steps to fix:')
    console.log('   1. Install Ollama: brew install ollama')
    console.log('   2. Start service: ollama serve')
    console.log('   3. Pull model: ollama pull llama3.2')
    return
  }

  console.log('\n2️⃣ Generating slide plan with AI...')
  
  try {
    const slidePlans = await ollamaService.generateSlidePlan({
      topic: 'Trí tuệ nhân tạo trong giáo dục',
      slideCount: 3,
      tone: 'professional',
      language: 'vi',
      includeImages: false
    })

    console.log('✅ Slide plans generated!')
    console.log(`📊 Total slides: ${slidePlans.length}`)
    console.log('\n📝 Slide preview:')
    
    slidePlans.forEach(slide => {
      console.log(`\n  Slide ${slide.slideNumber}: ${slide.title}`)
      console.log(`  Bullets: ${slide.bullets?.length || 0} items`)
      if (slide.bullets && slide.bullets.length > 0) {
        slide.bullets.forEach((bullet, i) => {
          console.log(`    ${i + 1}. ${bullet}`)
        })
      }
    })

    // 3. Generate PPTX
    console.log('\n3️⃣ Generating PowerPoint file...')
    
    const result = await pptxService.generatePresentation(slidePlans, {
      title: 'Test Presentation',
      author: 'Test Script'
    })

    console.log('✅ PowerPoint created successfully!')
    console.log(`📁 File: ${result.filename}`)
    console.log(`🔗 URL: ${result.url}`)
    console.log(`💾 Path: ${result.filepath}`)

    console.log('\n🎉 All tests passed!')
    console.log('\n💡 Next steps:')
    console.log('   1. Open the generated PPTX file')
    console.log('   2. Test the API with: curl http://localhost:3001/ai/health')
    console.log('   3. Open test-ai-slides.html in browser')

  } catch (error) {
    console.error('\n❌ Error generating slides:', error.message)
    console.error('Stack:', error.stack)
  }
}

// Run test
testOllama().catch(console.error)
