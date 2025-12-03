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
    },
    // Template 2: Education
    {
      name: 'Modern Education Course',
      category: 'Education',
      thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
      theme: { colors: ['#059669', '#ffffff', '#f0fdf4'] },
      slides: [
        {
          title: 'Course Introduction',
          background: '#059669',
          backgroundImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&h=1080&fit=crop',
          elements: [
            { type: 'shape', x: 0, y: 0, width: 960, height: 540, data: { shape: 'rectangle', fill: '#047857', opacity: 0.88 } },
            { type: 'text', x: 80, y: 130, width: 800, height: 140, data: { text: 'Modern Web Development', fontSize: 78, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' } },
            { type: 'text', x: 80, y: 290, width: 800, height: 90, data: { text: 'From Zero to Full-Stack Developer in 12 Weeks', fontSize: 36, color: '#d1fae5', textAlign: 'center' } },
            { type: 'text', x: 250, y: 410, width: 460, height: 60, data: { text: '100% Online • Live Classes • Certificate', fontSize: 24, color: '#ecfdf5', textAlign: 'center', fontWeight: '600' } }
          ]
        },
        {
          title: 'What You Will Learn',
          background: '#ffffff',
          backgroundImage: '',
          elements: [
            { type: 'text', x: 80, y: 50, width: 800, height: 80, data: { text: 'What You\'ll Master', fontSize: 52, fontWeight: 'bold', color: '#059669' } },
            { type: 'image', x: 520, y: 150, width: 400, height: 340, data: { imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=680&fit=crop', alt: 'Coding' } },
            { type: 'text', x: 80, y: 150, width: 420, height: 340, data: { text: '✅ HTML5, CSS3 & JavaScript ES6+\n\n✅ React, Vue & Modern Frameworks\n\n✅ Node.js & Express Backend\n\n✅ Database Design (SQL & NoSQL)\n\n✅ Git, Testing & Deployment\n\n✅ Build Real-World Projects', fontSize: 23, color: '#1f2937', lineHeight: 1.95, fontWeight: '500' } }
          ]
        },
        {
          title: 'Prerequisites',
          background: '#f0fdf4',
          backgroundImage: '',
          elements: [
            { type: 'text', x: 80, y: 50, width: 800, height: 80, data: { text: 'Who Should Enroll', fontSize: 52, fontWeight: 'bold', color: '#059669' } },
            { type: 'shape', x: 80, y: 160, width: 390, height: 310, data: { shape: 'rectangle', fill: '#ffffff', opacity: 1 } },
            { type: 'text', x: 110, y: 190, width: 330, height: 250, data: { text: '✓ Complete Beginners Welcome\n\n✓ Career Switchers\n\n✓ Self-Taught Developers\n\n✓ CS Students\n\n✓ Anyone Passionate About Tech', fontSize: 25, color: '#374151', lineHeight: 1.9, fontWeight: '500' } },
            { type: 'image', x: 500, y: 160, width: 410, height: 310, data: { imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=820&h=620&fit=crop', alt: 'Students' } }
          ]
        },
        {
          title: 'Phase 1: Frontend Fundamentals',
          background: '#ffffff',
          backgroundImage: '',
          elements: [
            { type: 'text', x: 80, y: 45, width: 800, height: 75, data: { text: 'Weeks 1-3: Frontend Fundamentals', fontSize: 48, fontWeight: 'bold', color: '#059669' } },
            { type: 'text', x: 100, y: 145, width: 380, height: 170, data: { text: '📘 Week 1-2: HTML & CSS\n• Semantic HTML5\n• Flexbox & Grid Layouts\n• Responsive Design\n• CSS Animations', fontSize: 21, color: '#1f2937', lineHeight: 1.75 } },
            { type: 'text', x: 520, y: 145, width: 380, height: 170, data: { text: '⚡ Week 3: JavaScript\n• Variables & Functions\n• DOM Manipulation\n• Events & Async Code\n• ES6+ Features', fontSize: 21, color: '#1f2937', lineHeight: 1.75 } },
            { type: 'shape', x: 80, y: 345, width: 800, height: 155, data: { shape: 'rectangle', fill: '#d1fae5', opacity: 1 } },
            { type: 'text', x: 110, y: 375, width: 740, height: 95, data: { text: '🎯 Project: Build Your Portfolio Website\nResponsive personal site with smooth animations', fontSize: 27, color: '#065f46', textAlign: 'center', fontWeight: 'bold', lineHeight: 1.6 } }
          ]
        },
        {
          title: 'Phase 2: Modern Frontend',
          background: '#f0fdf4',
          backgroundImage: '',
          elements: [
            { type: 'text', x: 80, y: 45, width: 800, height: 75, data: { text: 'Weeks 4-6: Modern Frontend Stack', fontSize: 48, fontWeight: 'bold', color: '#059669' } },
            { type: 'text', x: 100, y: 145, width: 380, height: 190, data: { text: '⚛️ Week 4-5: React Ecosystem\n• Components & Props\n• Hooks & State Management\n• React Router\n• Context API\n• Performance Tips', fontSize: 21, color: '#1f2937', lineHeight: 1.75 } },
            { type: 'text', x: 520, y: 145, width: 380, height: 190, data: { text: '🛠️ Week 6: Advanced Tools\n• TypeScript Basics\n• Tailwind CSS\n• Vite Build Tool\n• npm & Packages\n• Git Version Control', fontSize: 21, color: '#1f2937', lineHeight: 1.75 } },
            { type: 'shape', x: 80, y: 365, width: 800, height: 135, data: { shape: 'rectangle', fill: '#ffffff', opacity: 1 } },
            { type: 'text', x: 110, y: 390, width: 740, height: 85, data: { text: '🎯 Project: E-commerce Shopping App\nFull React app with cart, routing & API integration', fontSize: 26, color: '#065f46', textAlign: 'center', fontWeight: 'bold', lineHeight: 1.6 } }
          ]
        },
        {
          title: 'Phase 3: Backend Development',
          background: '#ffffff',
          backgroundImage: '',
          elements: [
            { type: 'text', x: 80, y: 45, width: 800, height: 75, data: { text: 'Weeks 7-9: Backend & Databases', fontSize: 48, fontWeight: 'bold', color: '#059669' } },
            { type: 'image', x: 530, y: 135, width: 390, height: 355, data: { imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=780&h=710&fit=crop', alt: 'Server' } },
            { type: 'text', x: 80, y: 145, width: 430, height: 335, data: { text: '🖥️ Week 7-8: Node.js & Express\n• REST API Design\n• Middleware & Routing\n• Authentication (JWT)\n• File Uploads\n\n💾 Week 9: Databases\n• SQL (PostgreSQL/MySQL)\n• NoSQL (MongoDB)\n• Prisma ORM\n• Query Optimization', fontSize: 21, color: '#1f2937', lineHeight: 1.8 } }
          ]
        },
        {
          title: 'Phase 4: Full-Stack Integration',
          background: '#f0fdf4',
          backgroundImage: '',
          elements: [
            { type: 'text', x: 80, y: 45, width: 800, height: 75, data: { text: 'Weeks 10-12: Full-Stack & Deploy', fontSize: 48, fontWeight: 'bold', color: '#059669' } },
            { type: 'text', x: 100, y: 145, width: 380, height: 205, data: { text: '🧪 Week 10: Testing\n• Unit Tests (Jest)\n• Integration Tests\n• E2E Testing (Cypress)\n• Code Quality\n• CI/CD Basics', fontSize: 21, color: '#1f2937', lineHeight: 1.75 } },
            { type: 'text', x: 520, y: 145, width: 380, height: 205, data: { text: '🚀 Week 11-12: Deployment\n• Docker Containers\n• Cloud (AWS/Vercel)\n• Performance Tuning\n• Security Practices\n• Monitoring', fontSize: 21, color: '#1f2937', lineHeight: 1.75 } },
            { type: 'shape', x: 80, y: 375, width: 800, height: 125, data: { shape: 'rectangle', fill: '#059669', opacity: 1 } },
            { type: 'text', x: 110, y: 400, width: 740, height: 75, data: { text: '🚀 Capstone: Social Media Platform\nFull-stack app with auth, posts, comments & deployment', fontSize: 27, color: '#ffffff', textAlign: 'center', fontWeight: 'bold', lineHeight: 1.5 } }
          ]
        },
        {
          title: 'Expert Instructors',
          background: '#ffffff',
          backgroundImage: '',
          elements: [
            { type: 'text', x: 80, y: 50, width: 800, height: 80, data: { text: 'Your Expert Instructors', fontSize: 52, fontWeight: 'bold', color: '#059669' } },
            { type: 'image', x: 130, y: 165, width: 155, height: 155, data: { imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=310&h=310&fit=crop', alt: 'Instructor' } },
            { type: 'text', x: 130, y: 335, width: 155, height: 95, data: { text: 'Dr. Alex Chen\nLead Instructor\n10y experience', fontSize: 17, color: '#374151', textAlign: 'center', lineHeight: 1.55 } },
            { type: 'image', x: 315, y: 165, width: 155, height: 155, data: { imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=310&h=310&fit=crop', alt: 'Instructor' } },
            { type: 'text', x: 315, y: 335, width: 155, height: 95, data: { text: 'Maria Rodriguez\nReact Specialist\n8y experience', fontSize: 17, color: '#374151', textAlign: 'center', lineHeight: 1.55 } },
            { type: 'image', x: 500, y: 165, width: 155, height: 155, data: { imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=310&h=310&fit=crop', alt: 'Instructor' } },
            { type: 'text', x: 500, y: 335, width: 155, height: 95, data: { text: 'James Wilson\nBackend Expert\n12y experience', fontSize: 17, color: '#374151', textAlign: 'center', lineHeight: 1.55 } },
            { type: 'image', x: 685, y: 165, width: 155, height: 155, data: { imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=310&h=310&fit=crop', alt: 'Instructor' } },
            { type: 'text', x: 685, y: 335, width: 155, height: 95, data: { text: 'Lisa Park\nDevOps Mentor\n9y experience', fontSize: 17, color: '#374151', textAlign: 'center', lineHeight: 1.55 } }
          ]
        },
        {
          title: 'Career Outcomes',
          background: '#f0fdf4',
          backgroundImage: '',
          elements: [
            { type: 'text', x: 80, y: 50, width: 800, height: 80, data: { text: 'Career Success Stories', fontSize: 52, fontWeight: 'bold', color: '#059669' } },
            { type: 'shape', x: 90, y: 165, width: 235, height: 175, data: { shape: 'rectangle', fill: '#059669', opacity: 1 } },
            { type: 'text', x: 110, y: 210, width: 195, height: 95, data: { text: '94%\nJob Placement', fontSize: 38, color: '#ffffff', textAlign: 'center', fontWeight: 'bold', lineHeight: 1.55 } },
            { type: 'shape', x: 362, y: 165, width: 235, height: 175, data: { shape: 'rectangle', fill: '#10b981', opacity: 1 } },
            { type: 'text', x: 382, y: 210, width: 195, height: 95, data: { text: '$75K\nAvg Salary', fontSize: 38, color: '#ffffff', textAlign: 'center', fontWeight: 'bold', lineHeight: 1.55 } },
            { type: 'shape', x: 634, y: 165, width: 235, height: 175, data: { shape: 'rectangle', fill: '#34d399', opacity: 1 } },
            { type: 'text', x: 654, y: 210, width: 195, height: 95, data: { text: '500+\nGraduates', fontSize: 38, color: '#ffffff', textAlign: 'center', fontWeight: 'bold', lineHeight: 1.55 } },
            { type: 'text', x: 80, y: 370, width: 800, height: 125, data: { text: '🏆 Certificate + Career Services Included\nLinkedIn Optimization • Resume Review • Interview Prep\n Alumni Network Access', fontSize: 23, color: '#065f46', textAlign: 'center', lineHeight: 1.85, fontWeight: '600' } }
          ]
        },
        {
          title: 'Enroll Today',
          background: '#059669',
          backgroundImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&h=1080&fit=crop',
          elements: [
            { type: 'shape', x: 0, y: 0, width: 960, height: 540, data: { shape: 'rectangle', fill: '#047857', opacity: 0.91 } },
            { type: 'text', x: 80, y: 95, width: 800, height: 105, data: { text: 'Start Your Tech Career Today', fontSize: 66, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' } },
            { type: 'text', x: 180, y: 235, width: 600, height: 165, data: { text: '$2,499 • 12 Weeks • Live Online\n\nNext Cohort Starts: January 15th, 2024', fontSize: 33, color: '#d1fae5', textAlign: 'center', lineHeight: 1.8 } },
            { type: 'shape', x: 330, y: 420, width: 300, height: 68, data: { shape: 'rectangle', fill: '#ffffff', opacity: 1 } },
            { type: 'text', x: 355, y: 438, width: 250, height: 40, data: { text: 'APPLY NOW →', fontSize: 28, color: '#059669', textAlign: 'center', fontWeight: 'bold' } }
          ]
        }
      ]
    },
    // Template 3: Marketing Strategy
    {
      name: 'Marketing Strategy 2024',
      category: 'Marketing',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      theme: { colors: ['#dc2626', '#ffffff', '#fef2f2'] },
      slides: [
        {
          title: 'Campaign Cover',
          background: '#dc2626',
          backgroundImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop',
          elements: [
            { type: 'shape', x: 0, y: 0, width: 960, height: 540, data: { shape: 'rectangle', fill: '#b91c1c', opacity: 0.87 } },
            { type: 'text', x: 80, y: 135, width: 800, height: 125, data: { text: 'Q1 2024 Marketing Strategy', fontSize: 74, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' } },
            { type: 'text', x: 80, y: 285, width: 800, height: 85, data: { text: 'Digital Transformation Campaign', fontSize: 40, color: '#fecaca', textAlign: 'center' } },
            { type: 'text', x: 310, y: 410, width: 340, height: 55, data: { text: 'Marketing Team • Q1 2024', fontSize: 24, color: '#fee2e2', textAlign: 'center', fontWeight: '600' } }
          ]
        },
        {
          title: 'Executive Summary',
          background: '#ffffff',
          backgroundImage: '',
          elements: [
            { type: 'text', x: 80, y: 50, width: 800, height: 80, data: { text: 'Campaign Overview', fontSize: 52, fontWeight: 'bold', color: '#dc2626' } },
            { type: 'image', x: 520, y: 150, width: 400, height: 340, data: { imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=680&fit=crop', alt: 'Analytics' } },
            { type: 'text', x: 80, y: 155, width: 420, height: 330, data: { text: '🎯 Goal: 50% Brand Awareness Increase\n\n💰 Budget: $2.5 Million\n\n📅 Duration: 12 Weeks\n\n🌍 Markets: US, EU, APAC\n\n📊 KPIs: Reach, Engagement, Conversions', fontSize: 24, color: '#1f2937', lineHeight: 2 } }
          ]
        },
        {
          title: 'Target Audience',
          background: '#fef2f2',
          backgroundImage: '',
          elements: [
            { type: 'text', x: 80, y: 50, width: 800, height: 80, data: { text: 'Target Audience Insights', fontSize: 52, fontWeight: 'bold', color: '#dc2626' } },
            { type: 'shape', x: 85, y: 165, width: 255, height: 295, data: { shape: 'rectangle', fill: '#dc2626', opacity: 1 } },
            { type: 'text', x: 105, y: 210, width: 215, height: 215, data: { text: '👥 Primary\nAge 25-45\nUrban Prof.\n$75K+ income\nTech-savvy', fontSize: 25, color: '#ffffff', textAlign: 'center', lineHeight: 1.9, fontWeight: '600' } },
            { type: 'shape', x: 355, y: 165, width: 255, height: 295, data: { shape: 'rectangle', fill: '#ef4444', opacity: 1 } },
            { type: 'text', x: 375, y: 210, width: 215, height: 215, data: { text: '🎓 Secondary\nAge 18-34\nStudents\nDigital natives\nPrice sensitive', fontSize: 25, color: '#ffffff', textAlign: 'center', lineHeight: 1.9, fontWeight: '600' } },
            { type: 'shape', x: 625, y: 165, width: 255, height: 295, data: { shape: 'rectangle', fill: '#f87171', opacity: 1 } },
            { type: 'text', x: 645, y: 210, width: 215, height: 215, data: { text: '💼 Tertiary\nAge 45-65\nExecutives\nDecision makers\nQuality focused', fontSize: 25, color: '#ffffff', textAlign: 'center', lineHeight: 1.9, fontWeight: '600' } }
          ]
        },
        {
          title: 'Strategic Objectives',
          background: '#ffffff',
          backgroundImage: '',
          elements: [
            { type: 'text', x: 80, y: 42, width: 800, height: 78, data: { text: 'Campaign Goals', fontSize: 52, fontWeight: 'bold', color: '#dc2626' } },
            { type: 'text', x: 100, y: 150, width: 380, height: 175, data: { text: '📈 Awareness Goals\n• 10M social impressions\n• 50% brand recall increase\n• Top 3 in category\n• 500+ media mentions', fontSize: 22, color: '#1f2937', lineHeight: 1.8 } },
            { type: 'text', x: 520, y: 150, width: 380, height: 175, data: { text: '💡 Engagement Goals\n• 500K website visits\n• 25% engagement rate\n• 100K+ video views\n• 50K email subscribers', fontSize: 22, color: '#1f2937', lineHeight: 1.8 } },
            { type: 'text', x: 100, y: 350, width: 380, height: 140, data: { text: '🎯 Conversion Goals\n• 20K qualified leads\n• 2,500 new customers\n• $5M revenue impact', fontSize: 22, color: '#1f2937', lineHeight: 1.8 } },
            { type: 'text', x: 520, y: 350, width: 380, height: 140, data: { text: '💰 ROI Targets\n• 300% ROI\n• $2 CAC\n• 20% conversion rate', fontSize: 22, color: '#1f2937', lineHeight: 1.8 } }
          ]
        },
        {
          title: 'Channel Strategy',
          background: '#fef2f2',
          backgroundImage: '',
          elements: [
            { type: 'text', x: 80, y: 50, width: 800, height: 80, data: { text: 'Multi-Channel Approach', fontSize: 52, fontWeight: 'bold', color: '#dc2626' } },
            { type: 'image', x: 520, y: 150, width: 400, height: 340, data: { imageUrl: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800&h=680&fit=crop', alt: 'Social Media' } },
            { type: 'text', x: 80, y: 155, width: 425, height: 330, data: { text: '📱 Social Media (35%)\n   Instagram, TikTok, LinkedIn\n\n🔍 Search/SEO (25%)\n   Google Ads, Organic\n\n📧 Email Marketing (20%)\n   Newsletter, Automation\n\n🎥 Video Content (15%)\n   YouTube, Shorts\n\n📰 PR & Influencer (5%)', fontSize: 21, color: '#1f2937', lineHeight: 1.75 } }
          ]
        },
        {
          title: 'Content Marketing',
          background: '#ffffff',
          backgroundImage: '',
          elements: [
            { type: 'text', x: 80, y: 42, width: 800, height: 78, data: { text: 'Content Marketing Mix', fontSize: 52, fontWeight: 'bold', color: '#dc2626' } },
            { type: 'shape', x: 90, y: 155, width: 185, height: 155, data: { shape: 'rectangle', fill: '#fef2f2', opacity: 1 } },
            { type: 'text', x: 105, y: 180, width: 155, height: 105, data: { text: '📝 Blog\n48 posts\n2x/week', fontSize: 23, color: '#991b1b', textAlign: 'center', lineHeight: 1.7, fontWeight: '600' } },
            { type: 'shape', x: 295, y: 155, width: 185, height: 155, data: { shape: 'rectangle', fill: '#fef2f2', opacity: 1 } },
            { type: 'text', x: 310, y: 180, width: 155, height: 105, data: { text: '🎬 Video\n24 videos\n1x/week', fontSize: 23, color: '#991b1b', textAlign: 'center', lineHeight: 1.7, fontWeight: '600' } },
            { type: 'shape', x: 500, y: 155, width: 185, height: 155, data: { shape: 'rectangle', fill: '#fef2f2', opacity: 1 } },
            { type: 'text', x: 515, y: 180, width: 155, height: 105, data: { text: '📸 Social\n120 posts\n10x/week', fontSize: 23, color: '#991b1b', textAlign: 'center', lineHeight: 1.7, fontWeight: '600' } },
            { type: 'shape', x: 705, y: 155, width: 185, height: 155, data: { shape: 'rectangle', fill: '#fef2f2', opacity: 1 } },
            { type: 'text', x: 720, y: 180, width: 155, height: 105, data: { text: '📧 Email\n36 campaigns\n3x/week', fontSize: 23, color: '#991b1b', textAlign: 'center', lineHeight: 1.7, fontWeight: '600' } },
            { type: 'text', x: 80, y: 345, width: 800, height: 150, data: { text: '🎯 Content Themes:\nCustomer Success Stories • Product Tutorials • Industry Trends\nBehind-the-Scenes • Expert Interviews • UGC', fontSize: 23, color: '#374151', textAlign: 'center', lineHeight: 1.9 } }
          ]
        },
        {
          title: 'Campaign Timeline',
          background: '#fef2f2',
          backgroundImage: '',
          elements: [
            { type: 'text', x: 80, y: 42, width: 800, height: 78, data: { text: '12-Week Roadmap', fontSize: 52, fontWeight: 'bold', color: '#dc2626' } },
            { type: 'shape', x: 90, y: 155, width: 185, height: 115, data: { shape: 'rectangle', fill: '#dc2626', opacity: 1 } },
            { type: 'text', x: 105, y: 183, width: 155, height: 65, data: { text: 'Week 1-3\nLaunch', fontSize: 25, color: '#ffffff', textAlign: 'center', fontWeight: 'bold', lineHeight: 1.6 } },
            { type: 'shape', x: 295, y: 155, width: 185, height: 115, data: { shape: 'rectangle', fill: '#ef4444', opacity: 1 } },
            { type: 'text', x: 310, y: 183, width: 155, height: 65, data: { text: 'Week 4-6\nEngage', fontSize: 25, color: '#ffffff', textAlign: 'center', fontWeight: 'bold', lineHeight: 1.6 } },
            { type: 'shape', x: 500, y: 155, width: 185, height: 115, data: { shape: 'rectangle', fill: '#f87171', opacity: 1 } },
            { type: 'text', x: 515, y: 183, width: 155, height: 65, data: { text: 'Week 7-9\nConvert', fontSize: 25, color: '#ffffff', textAlign: 'center', fontWeight: 'bold', lineHeight: 1.6 } },
            { type: 'shape', x: 705, y: 155, width: 185, height: 115, data: { shape: 'rectangle', fill: '#fca5a5', opacity: 1 } },
            { type: 'text', x: 720, y: 183, width: 155, height: 65, data: { text: 'Week 10-12\nOptimize', fontSize: 25, color: '#ffffff', textAlign: 'center', fontWeight: 'bold', lineHeight: 1.6 } },
            { type: 'text', x: 80, y: 305, width: 800, height: 175, data: { text: '📋 Key Milestones:\n✓ Launch event & PR push\n✓ Influencer partnerships activated\n✓ Lead generation campaigns\n✓ Performance optimization & reporting', fontSize: 23, color: '#374151', lineHeight: 2 } }
          ]
        },
        {
          title: 'Budget Allocation',
          background: '#ffffff',
          backgroundImage: '',
          elements: [
            { type: 'text', x: 80, y: 50, width: 800, height: 80, data: { text: 'Investment Breakdown', fontSize: 52, fontWeight: 'bold', color: '#dc2626' } },
            { type: 'shape', x: 85, y: 165, width: 375, height: 95, data: { shape: 'rectangle', fill: '#dc2626', opacity: 1 } },
            { type: 'text', x: 105, y: 190, width: 335, height: 50, data: { text: 'Paid Media: $1,250K (50%)', fontSize: 29, color: '#ffffff', fontWeight: 'bold' } },
            { type: 'shape', x: 500, y: 165, width: 375, height: 95, data: { shape: 'rectangle', fill: '#ef4444', opacity: 1 } },
            { type: 'text', x: 520, y: 190, width: 335, height: 50, data: { text: 'Content Creation: $625K (25%)', fontSize: 29, color: '#ffffff', fontWeight: 'bold' } },
            { type: 'shape', x: 85, y: 280, width: 375, height: 95, data: { shape: 'rectangle', fill: '#f87171', opacity: 1 } },
            { type: 'text', x: 105, y: 305, width: 335, height: 50, data: { text: 'Tools & Tech: $375K (15%)', fontSize: 29, color: '#ffffff', fontWeight: 'bold' } },
            { type: 'shape', x: 500, y: 280, width: 375, height: 95, data: { shape: 'rectangle', fill: '#fca5a5', opacity: 1 } },
            { type: 'text', x: 520, y: 305, width: 335, height: 50, data: { text: 'Agency & Talent: $250K (10%)', fontSize: 29, color: '#ffffff', fontWeight: 'bold' } },
            { type: 'text', x: 80, y: 415, width: 800, height: 70, data: { text: '💡 Total: $2.5M • Expected ROI: 300% ($7.5M)', fontSize: 25, color: '#991b1b', textAlign: 'center', fontWeight: 'bold' } }
          ]
        },
        {
          title: 'Core Team',
          background: '#fef2f2',
          backgroundImage: '',
          elements: [
            { type: 'text', x: 80, y: 50, width: 800, height: 80, data: { text: 'Marketing Team', fontSize: 52, fontWeight: 'bold', color: '#dc2626' } },
            { type: 'image', x: 125, y: 165, width: 135, height: 135, data: { imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=270&h=270&fit=crop', alt: 'Team' } },
            { type: 'text', x: 125, y: 315, width: 135, height: 85, data: { text: 'Sarah Kim\nCampaign Lead\nStrategy', fontSize: 17, color: '#374151', textAlign: 'center', lineHeight: 1.5 } },
            { type: 'image', x: 285, y: 165, width: 135, height: 135, data: { imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=270&h=270&fit=crop', alt: 'Team' } },
            { type: 'text', x: 285, y: 315, width: 135, height: 85, data: { text: 'Tom Johnson\nContent Dir.\nCreative', fontSize: 17, color: '#374151', textAlign: 'center', lineHeight: 1.5 } },
            { type: 'image', x: 445, y: 165, width: 135, height: 135, data: { imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=270&h=270&fit=crop', alt: 'Team' } },
            { type: 'text', x: 445, y: 315, width: 135, height: 85, data: { text: 'Emma Lee\nSocial Media\nEngagement', fontSize: 17, color: '#374151', textAlign: 'center', lineHeight: 1.5 } },
            { type: 'image', x: 605, y: 165, width: 135, height: 135, data: { imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=270&h=270&fit=crop', alt: 'Team' } },
            { type: 'text', x: 605, y: 315, width: 135, height: 85, data: { text: 'David Chen\nData Analyst\nMetrics', fontSize: 17, color: '#374151', textAlign: 'center', lineHeight: 1.5 } },
            { type: 'image', x: 765, y: 165, width: 135, height: 135, data: { imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=270&h=270&fit=crop', alt: 'Team' } },
            { type: 'text', x: 765, y: 315, width: 135, height: 85, data: { text: 'Nina Patel\nPR Manager\nMedia', fontSize: 17, color: '#374151', textAlign: 'center', lineHeight: 1.5 } }
          ]
        },
        {
          title: 'Success Metrics',
          background: '#dc2626',
          backgroundImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop',
          elements: [
            { type: 'shape', x: 0, y: 0, width: 960, height: 540, data: { shape: 'rectangle', fill: '#b91c1c', opacity: 0.91 } },
            { type: 'text', x: 80, y: 85, width: 800, height: 105, data: { text: 'How We Measure Success', fontSize: 66, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' } },
            { type: 'text', x: 100, y: 225, width: 760, height: 225, data: { text: '📊 Weekly Reports & Dashboards\n📈 A/B Testing & Optimization\n🎯 Real-time Performance Tracking\n💡 Monthly Strategy Reviews\n🏆 Final Campaign ROI Analysis', fontSize: 31, color: '#fecaca', lineHeight: 2, fontWeight: '600', textAlign: 'center' } }
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
