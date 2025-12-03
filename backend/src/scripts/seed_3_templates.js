import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main(){
  // ============= CREATE USERS =============
  console.log('Creating users...')
  const email = 'test@example.com'
  const password = await bcrypt.hash('Test@123', 10)
  await prisma.user.upsert({ where: { email }, update: { password }, create: { email, password, name: 'Demo User', role: 'user' } })
  
  const adminEmail = 'admin@example.com'
  const adminPass = await bcrypt.hash('Admin@123', 10)
  await prisma.user.upsert({ where: { email: adminEmail }, update: { password: adminPass }, create: { email: adminEmail, password: adminPass, name: 'Admin User', role: 'admin' } })

  // Get user objects for later use
  const user = await prisma.user.findUnique({ where: { email } })
  const admin = await prisma.user.findUnique({ where: { email: adminEmail } })

  // ============= CREATE RICH TEMPLATES WITH 10 SLIDES EACH =============
  console.log('Creating rich templates with 10 beautiful slides each...')
  
  const templateDefinitions = [
    {
      name: 'Business Pitch Deck Pro',
      category: 'Business',
      thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
      theme: { colors: ['#1a56db', '#ffffff', '#f3f4f6'] },
      slides: [
        // Slide 1: Cover
        {
          title: 'Cover Slide',
          background: '#1a56db',
          backgroundImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop',
          elements: [
            { type: 'shape', x: 0, y: 0, width: 960, height: 540, data: { shape: 'rectangle', fill: '#1a56db', opacity: 0.85 } },
            { type: 'text', x: 80, y: 150, width: 800, height: 120, data: { text: 'TechVision AI', fontSize: 82, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' } },
            { type: 'text', x: 80, y: 280, width: 800, height: 70, data: { text: 'Revolutionizing Business Intelligence with AI', fontSize: 38, color: '#bfdbfe', textAlign: 'center' } },
            { type: 'text', x: 300, y: 380, width: 360, height: 50, data: { text: 'Series A Investment Deck | Q4 2025', fontSize: 22, color: '#e0e7ff', textAlign: 'center' } },
            { type: 'shape', x: 750, y: 420, width: 180, height: 180, data: { shape: 'circle', fill: '#3b82f6', opacity: 0.2 } }
          ]
        },
        // Slide 2: Problem
        {
          title: 'The Problem',
          background: '#ffffff',
          backgroundImage: '',
          elements: [
            { type: 'text', x: 80, y: 50, width: 800, height: 80, data: { text: 'The Challenge We\'re Solving', fontSize: 52, fontWeight: 'bold', color: '#1a56db' } },
            { type: 'shape', x: 60, y: 145, width: 8, height: 320, data: { shape: 'rectangle', fill: '#1a56db', opacity: 1 } },
            { type: 'image', x: 520, y: 150, width: 400, height: 320, data: { imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=640&fit=crop', alt: 'Problem' } },
            { type: 'text', x: 80, y: 150, width: 420, height: 320, data: { text: '📊 Companies waste $2.5M annually\non manual data analysis\n\n⏰ 60% of decisions delayed\ndue to lack of insights\n\n🔍 Traditional BI tools require\nweeks of training\n\n💸 90% of SMBs can\'t afford\nenterprise solutions', fontSize: 24, color: '#374151', lineHeight: 1.8 } }
          ]
        },
        // Slide 3: Solution
        {
          title: 'Our Solution',
          background: '#f8fafc',
          backgroundImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&h=1080&fit=crop',
          elements: [
            { type: 'shape', x: 0, y: 0, width: 960, height: 540, data: { shape: 'rectangle', fill: '#0f172a', opacity: 0.80 } },
            { type: 'text', x: 80, y: 120, width: 800, height: 100, data: { text: 'AI-Powered Business Intelligence', fontSize: 68, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' } },
            { type: 'text', x: 120, y: 250, width: 720, height: 180, data: { text: 'Get instant insights from your data\nusing natural language queries.\nNo training required.\nAnswers in seconds, not weeks.', fontSize: 34, color: '#e0e7ff', textAlign: 'center', lineHeight: 1.6 } }
          ]
        },
        // Slide 4: Product Demo
        {
          title: 'Product Demo',
          background: '#ffffff',
          backgroundImage: '',
          elements: [
            { type: 'text', x: 80, y: 50, width: 800, height: 80, data: { text: 'How It Works', fontSize: 52, fontWeight: 'bold', color: '#1a56db' } },
            { type: 'image', x: 80, y: 150, width: 800, height: 350, data: { imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=700&fit=crop', alt: 'Dashboard' } },
            { type: 'shape', x: 300, y: 480, width: 360, height: 4, data: { shape: 'rectangle', fill: '#1a56db', opacity: 1 } }
          ]
        },
        // Slide 5: Features
        {
          title: 'Key Features',
          background: '#f8fafc',
          backgroundImage: '',
          elements: [
            { type: 'text', x: 80, y: 50, width: 800, height: 80, data: { text: 'Powerful Features', fontSize: 52, fontWeight: 'bold', color: '#1a56db' } },
            { type: 'shape', x: 80, y: 160, width: 380, height: 150, data: { shape: 'rectangle', fill: '#ffffff', opacity: 1 } },
            { type: 'text', x: 110, y: 190, width: 320, height: 90, data: { text: '🤖 Natural Language AI\nAsk questions in plain English', fontSize: 22, color: '#1f2937', lineHeight: 1.6 } },
            { type: 'shape', x: 500, y: 160, width: 380, height: 150, data: { shape: 'rectangle', fill: '#ffffff', opacity: 1 } },
            { type: 'text', x: 530, y: 190, width: 320, height: 90, data: { text: '📊 Real-time Analytics\nLive data visualization', fontSize: 22, color: '#1f2937', lineHeight: 1.6 } },
            { type: 'shape', x: 80, y: 330, width: 380, height: 150, data: { shape: 'rectangle', fill: '#ffffff', opacity: 1 } },
            { type: 'text', x: 110, y: 360, width: 320, height: 90, data: { text: '🔒 Enterprise Security\nBank-level encryption', fontSize: 22, color: '#1f2937', lineHeight: 1.6 } },
            { type: 'shape', x: 500, y: 330, width: 380, height: 150, data: { shape: 'rectangle', fill: '#ffffff', opacity: 1 } },
            { type: 'text', x: 530, y: 360, width: 320, height: 90, data: { text: '🚀 Instant Deployment\nUp and running in minutes', fontSize: 22, color: '#1f2937', lineHeight: 1.6 } }
          ]
        },
        // Slide 6: Market Size
        {
          title: 'Market Opportunity',
          background: '#1a56db',
          backgroundImage: '',
          elements: [
            { type: 'text', x: 80, y: 50, width: 800, height: 80, data: { text: 'Massive Market Opportunity', fontSize: 56, fontWeight: 'bold', color: '#ffffff' } },
            { type: 'shape', x: 80, y: 170, width: 240, height: 240, data: { shape: 'circle', fill: '#3b82f6', opacity: 1 } },
            { type: 'text', x: 100, y: 240, width: 200, height: 120, data: { text: '$45B\nTAM', fontSize: 48, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' } },
            { type: 'shape', x: 360, y: 170, width: 240, height: 240, data: { shape: 'circle', fill: '#60a5fa', opacity: 1 } },
            { type: 'text', x: 380, y: 240, width: 200, height: 120, data: { text: '$12B\nSAM', fontSize: 48, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' } },
            { type: 'shape', x: 640, y: 170, width: 240, height: 240, data: { shape: 'circle', fill: '#93c5fd', opacity: 1 } },
            { type: 'text', x: 660, y: 240, width: 200, height: 120, data: { text: '$2.8B\nSOM', fontSize: 48, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' } }
          ]
        },
        // Slide 7: Business Model
        {
          title: 'Business Model',
          background: '#ffffff',
          backgroundImage: '',
          elements: [
            { type: 'text', x: 80, y: 50, width: 800, height: 80, data: { text: 'Revenue Streams', fontSize: 52, fontWeight: 'bold', color: '#1a56db' } },
            { type: 'shape', x: 80, y: 160, width: 250, height: 220, data: { shape: 'rectangle', fill: '#1a56db', opacity: 1 } },
            { type: 'text', x: 100, y: 200, width: 210, height: 160, data: { text: '💼 Enterprise\n\n$999/mo\n\n50% margin', fontSize: 26, color: '#ffffff', textAlign: 'center', fontWeight: 'bold', lineHeight: 1.8 } },
            { type: 'shape', x: 355, y: 160, width: 250, height: 220, data: { shape: 'rectangle', fill: '#3b82f6', opacity: 1 } },
            { type: 'text', x: 375, y: 200, width: 210, height: 160, data: { text: '🏢 Business\n\n$299/mo\n\n60% margin', fontSize: 26, color: '#ffffff', textAlign: 'center', fontWeight: 'bold', lineHeight: 1.8 } },
            { type: 'shape', x: 630, y: 160, width: 250, height: 220, data: { shape: 'rectangle', fill: '#60a5fa', opacity: 1 } },
            { type: 'text', x: 650, y: 200, width: 210, height: 160, data: { text: '👤 Starter\n\n$49/mo\n\n70% margin', fontSize: 26, color: '#ffffff', textAlign: 'center', fontWeight: 'bold', lineHeight: 1.8 } }
          ]
        },
        // Slide 8: Traction
        {
          title: 'Traction & Growth',
          background: '#f8fafc',
          backgroundImage: '',
          elements: [
            { type: 'text', x: 80, y: 50, width: 800, height: 80, data: { text: 'Our Progress', fontSize: 52, fontWeight: 'bold', color: '#1a56db' } },
            { type: 'image', x: 500, y: 140, width: 400, height: 360, data: { imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=720&fit=crop', alt: 'Growth' } },
            { type: 'text', x: 80, y: 150, width: 400, height: 340, data: { text: '✅ 15,000+ active users\n\n✅ $1.2M ARR (Annual Recurring Revenue)\n\n✅ 150% YoY growth rate\n\n✅ 95% customer retention\n\n✅ Partnerships with\n     Fortune 500 companies', fontSize: 26, color: '#1f2937', lineHeight: 1.9, fontWeight: '600' } }
          ]
        },
        // Slide 9: Team
        {
          title: 'The Team',
          background: '#ffffff',
          backgroundImage: '',
          elements: [
            { type: 'text', x: 80, y: 50, width: 800, height: 80, data: { text: 'World-Class Leadership', fontSize: 52, fontWeight: 'bold', color: '#1a56db' } },
            { type: 'image', x: 80, y: 160, width: 180, height: 180, data: { imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=360&h=360&fit=crop', alt: 'CEO' } },
            { type: 'text', x: 80, y: 355, width: 180, height: 100, data: { text: 'John Smith\nCEO & Founder\nEx-Google', fontSize: 18, color: '#374151', textAlign: 'center', lineHeight: 1.6, fontWeight: '600' } },
            { type: 'image', x: 280, y: 160, width: 180, height: 180, data: { imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=360&h=360&fit=crop', alt: 'CTO' } },
            { type: 'text', x: 280, y: 355, width: 180, height: 100, data: { text: 'Sarah Lee\nCTO\nEx-Microsoft', fontSize: 18, color: '#374151', textAlign: 'center', lineHeight: 1.6, fontWeight: '600' } },
            { type: 'image', x: 480, y: 160, width: 180, height: 180, data: { imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=360&h=360&fit=crop', alt: 'CPO' } },
            { type: 'text', x: 480, y: 355, width: 180, height: 100, data: { text: 'Mike Chen\nCPO\nEx-Amazon', fontSize: 18, color: '#374151', textAlign: 'center', lineHeight: 1.6, fontWeight: '600' } },
            { type: 'image', x: 680, y: 160, width: 180, height: 180, data: { imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=360&h=360&fit=crop', alt: 'CMO' } },
            { type: 'text', x: 680, y: 355, width: 180, height: 100, data: { text: 'Emily Davis\nCMO\nEx-Meta', fontSize: 18, color: '#374151', textAlign: 'center', lineHeight: 1.6, fontWeight: '600' } }
          ]
        },
        // Slide 10: The Ask
        {
          title: 'Investment Ask',
          background: '#1a56db',
          backgroundImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&h=1080&fit=crop',
          elements: [
            { type: 'shape', x: 0, y: 0, width: 960, height: 540, data: { shape: 'rectangle', fill: '#1e40af', opacity: 0.92 } },
            { type: 'text', x: 80, y: 100, width: 800, height: 100, data: { text: 'Join Us in Transforming BI', fontSize: 64, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' } },
            { type: 'text', x: 120, y: 230, width: 720, height: 200, data: { text: 'Raising $10M Series A\n\nto scale operations, expand our team,\nand capture significant market share\nin the growing BI industry', fontSize: 32, color: '#bfdbfe', textAlign: 'center', lineHeight: 1.8 } },
            { type: 'text', x: 280, y: 450, width: 400, height: 60, data: { text: 'contact@techvision.ai', fontSize: 28, color: '#ffffff', textAlign: 'center', fontWeight: 'bold' } }
          ]
        }
      ]
    }
  ]

  // Create templates and their sample slides
  for (const tmplDef of templateDefinitions) {
    let template = await prisma.template.findFirst({ where: { name: tmplDef.name } })
    
    if (!template) {
      template = await prisma.template.create({ 
        data: { 
          name: tmplDef.name, 
          category: tmplDef.category, 
          thumbnail: tmplDef.thumbnail,
          data: JSON.stringify({ 
            theme: tmplDef.theme,
            slideCount: tmplDef.slides.length
          }) 
        } 
      })
      console.log(`✅ Created template: ${template.name}`)
    }

    // Create sample presentation for this template
    const samplePresTitle = `${tmplDef.name} - Sample`
    let samplePres = await prisma.presentation.findFirst({ 
      where: { title: samplePresTitle, templateId: template.id } 
    })
    
    if (!samplePres && admin) {
      samplePres = await prisma.presentation.create({
        data: {
          userId: admin.id,
          title: samplePresTitle,
          templateId: template.id
        }
      })
      console.log(`📊 Created sample presentation: ${samplePresTitle}`)

      // Create slides for this template
      for (let i = 0; i < tmplDef.slides.length; i++) {
        const slideDef = tmplDef.slides[i]
        const slide = await prisma.slide.create({
          data: {
            presentationId: samplePres.id,
            orderIndex: i + 1,
            title: slideDef.title,
            content: JSON.stringify({
              background: slideDef.background,
              backgroundImage: slideDef.backgroundImage
            })
          }
        })

        // Create elements for this slide
        if (slideDef.elements && slideDef.elements.length > 0) {
          await prisma.element.createMany({
            data: slideDef.elements.map((elem, idx) => ({
              slideId: slide.id,
              type: elem.type,
              x: elem.x,
              y: elem.y,
              width: elem.width,
              height: elem.height,
              zIndex: elem.data.zIndex || idx,
              rotation: elem.data.rotation || 0,
              data: JSON.stringify(elem.data)
            }))
          })
        }
        console.log(`   └─ Slide ${i+1}: ${slideDef.title} (${slideDef.elements.length} elements)`)
      }
    }
  }

  console.log('\n✅ Seed complete!')
  console.log('📊 Database Summary:')
  const counts = {
    users: await prisma.user.count(),
    templates: await prisma.template.count(),
    presentations: await prisma.presentation.count(),
    slides: await prisma.slide.count(),
    elements: await prisma.element.count()
  }
  console.log(`  - Users: ${counts.users}`)
  console.log(`  - Templates: ${counts.templates}`)
  console.log(`  - Presentations: ${counts.presentations}`)
  console.log(`  - Slides: ${counts.slides}`)
  console.log(`  - Elements: ${counts.elements}`)
  console.log('\n🔐 Login Credentials:')
  console.log('  👤 Demo User: test@example.com / Test@123')
  console.log('  👑 Admin: admin@example.com / Admin@123')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(()=>prisma.$disconnect())
