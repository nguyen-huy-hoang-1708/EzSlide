import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const slide = await prisma.slide.findUnique({
  where: { id: 394 },
  include: { elements: { orderBy: { zIndex: 'asc' } } }
});

if (!slide) {
  console.log('Slide 394 not found');
} else {
  console.log('Slide:', slide.id, slide.title);
  console.log('Elements:', slide.elements.length);
  
  slide.elements.forEach(e => {
    const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
    console.log('---');
    console.log('Type:', e.type);
    console.log('Pos:', e.x, e.y, 'Size:', e.width, e.height);
    console.log('Data keys:', Object.keys(data));
    if (data.text) console.log('Text:', data.text.substring(0, 100));
    if (data.imageUrl) console.log('Image:', data.imageUrl);
    if (data.shape) console.log('Shape:', data.shape, 'Fill:', data.fill);
  });
}

await prisma.$disconnect();
