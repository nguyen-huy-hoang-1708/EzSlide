import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function cleanupDuplicates() {
  try {
    const users = await prisma.user.findMany();
    
    for (const user of users) {
      const presentations = await prisma.presentation.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'asc' }
      });
      
      // Group by title, keep oldest
      const seen = new Map();
      const toDelete = [];
      
      presentations.forEach(p => {
        if (!seen.has(p.title)) {
          seen.set(p.title, p.id);
        } else {
          toDelete.push(p.id);
        }
      });
      
      if (toDelete.length > 0) {
        console.log(`User ${user.username || user.id}: Deleting ${toDelete.length} duplicates...`);
        
        // Delete cascade: elements -> slides -> presentations
        for (const presentationId of toDelete) {
          const slides = await prisma.slide.findMany({
            where: { presentationId }
          });
          
          for (const slide of slides) {
            await prisma.element.deleteMany({
              where: { slideId: slide.id }
            });
          }
          
          await prisma.slide.deleteMany({
            where: { presentationId }
          });
        }
        
        // Finally delete presentations
        await prisma.presentation.deleteMany({
          where: { id: { in: toDelete } }
        });
      }
    }
    
    console.log('✅ Cleanup completed!');
    
    // Show remaining
    const remaining = await prisma.presentation.count();
    console.log(`Total presentations remaining: ${remaining}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDuplicates();
