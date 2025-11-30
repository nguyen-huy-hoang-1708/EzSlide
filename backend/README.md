# Backend — Slides API

This folder contains the Express API and Prisma schema.

Quick start

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
cp .env.example .env
# Edit .env to set JWT_SECRET and DATABASE_URL
# Edit .env to set JWT_SECRET and DATABASE_URL
npx prisma generate
npx prisma migrate dev --name init
# Run dev server (nodemon watches src)
npm run dev

Default users created by `npm run seed`:
- admin@example.com / adminpass (role: admin)
- test@example.com / password (role: user)
```

API routes
- POST /auth/register
- POST /auth/login
- POST /auth/reset-password
- GET/POST/PUT/DELETE /slides
- GET /slides/:id/export?format=pdf|pptx (example)
- GET /templates
- POST /assets/upload
- POST /ai/generate

Notes
- The AI endpoint is a placeholder. Replace with a call to your AI provider.
- The export endpoint returns a pseudo file (you should integrate PPTX/PDF generation).
