import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main(){
  const templates = [
    { name: 'Business Pitch', category: 'Business', thumbnail: '', data: '{}' },
    { name: 'Education Lecture', category: 'Education', thumbnail: '', data: '{}' }
  ]
  for (const t of templates){
    const existing = await prisma.template.findFirst({ where: { name: t.name } })
    if (!existing) await prisma.template.create({ data: t })
  }
  const email = 'test@example.com'
  const password = await bcrypt.hash('password', 10)
  await prisma.user.upsert({ where: { email }, update: { password }, create: { email, password, name: 'Demo User', role: 'user' } })
  // create admin user
  const adminEmail = 'admin@example.com'
  const adminPass = await bcrypt.hash('adminpass', 10)
  await prisma.user.upsert({ where: { email: adminEmail }, update: { password: adminPass }, create: { email: adminEmail, password: adminPass, name: 'Admin User', role: 'admin' } })

  // Create sample presentations & slides & elements
  const user = await prisma.user.findUnique({ where: { email } })
  if (user) {
    const existingPres = await prisma.presentation.findFirst({ where: { title: 'My First Presentation', userId: user.id } })
    if (!existingPres) {
      const p1 = await prisma.presentation.create({ data: { userId: user.id, title: 'My First Presentation' } })
      const s1 = await prisma.slide.create({ data: { presentationId: p1.id, orderIndex: 1, title: 'Intro' } })
      const s2 = await prisma.slide.create({ data: { presentationId: p1.id, orderIndex: 2, title: 'Key Points' } })
      const s3 = await prisma.slide.create({ data: { presentationId: p1.id, orderIndex: 3, title: 'Conclusion' } })
      await prisma.element.createMany({ data: [
        { slideId: s1.id, type: 'text', x: 100, y: 100, width: 400, height: 100, zIndex: 1, rotation: 0, data: { text: 'Welcome to Our Presentation', fontSize: 48, fontWeight: 'bold', color: '#333333' } },
        { slideId: s1.id, type: 'image', x: 100, y: 250, width: 600, height: 400, zIndex: 0, rotation: 0, data: { imageUrl: 'https://example.com/image1.jpg', alt: 'Cover image' } }
      ]})
    }
  }
  console.log('Seed complete')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(()=>prisma.$disconnect())
