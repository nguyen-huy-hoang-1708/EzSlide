import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupLargeElements() {
  try {
    console.log('🔍 Finding large elements...')
    
    // Get all slides
    const slides = await prisma.slide.findMany({
      select: { id: true, title: true }
    })
    
    console.log(`Found ${slides.length} slides`)
    
    let deletedCount = 0
    
    for (const slide of slides) {
      try {
        // Try to get elements for this slide
        const elements = await prisma.$queryRaw`
          SELECT id, type, CHAR_LENGTH(data) as dataSize 
          FROM Element 
          WHERE slideId = ${slide.id}
        `
        
        console.log(`\nSlide ${slide.id} (${slide.title}): ${elements.length} elements`)
        
        for (const elem of elements) {
          const sizeKB = Number(elem.dataSize) / 1024
          const sizeMB = sizeKB / 1024
          
          console.log(`  - Element ${elem.id} (${elem.type}): ${sizeMB.toFixed(2)}MB`)
          
          // Delete elements larger than 5MB
          if (sizeMB > 5) {
            console.log(`    ⚠️  TOO LARGE! Deleting...`)
            await prisma.element.delete({
              where: { id: elem.id }
            })
            deletedCount++
            console.log(`    ✅ Deleted`)
          }
        }
      } catch (err) {
        console.error(`Error processing slide ${slide.id}:`, err.message)
      }
    }
    
    console.log(`\n✅ Cleanup complete! Deleted ${deletedCount} large elements`)
    
  } catch (err) {
    console.error('Cleanup failed:', err)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupLargeElements()
