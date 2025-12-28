# Backend — Slides API

This folder contains the Express API and Prisma schema.

## 🚀 Quick start

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
cp .env.example .env
# Edit .env to set JWT_SECRET and DATABASE_URL
npm run dev
```

Default users created by `npm run seed`:
- admin@example.com / adminpass (role: admin)
- test@example.com / password (role: user)

## 🤖 AI Integration (NEW!)

Backend đã tích hợp **Ollama** (AI local) để tạo slides tự động.

### Setup Ollama:

1. **Cài đặt Ollama:**
   ```bash
   # macOS
   brew install ollama
   
   # Linux
   curl -fsSL https://ollama.com/install.sh | sh
   ```

2. **Khởi động service:**
   ```bash
   ollama serve
   ```

3. **Pull model:**
   ```bash
   ollama pull llama3.2
   ```

4. **Test AI endpoint:**
   ```bash
   curl http://localhost:3001/ai/health
   ```

📖 **Chi tiết đầy đủ:** Xem [AI_INTEGRATION_GUIDE.md](./AI_INTEGRATION_GUIDE.md)

## 📡 API routes

### Authentication
- POST /auth/register
- POST /auth/login
- POST /auth/reset-password

### Slides & Presentations
- GET/POST/PUT/DELETE /slides
- GET /slides/:id/export?format=pdf|pptx
- GET/POST /presentations
- GET /presentations/:id

### AI Generation (NEW!)
- **POST /ai/generate-slides** - Tạo slides bằng AI + export PPTX
- **GET /ai/health** - Kiểm tra Ollama status
- **POST /ai/pull-model** - Pull model về máy

### Templates & Assets
- GET /templates
- POST /assets/upload

## 🛠️ Tech Stack

- **Express.js** - Web framework
- **Prisma** - ORM
- **MySQL** - Database
- **JWT** - Authentication
- **Ollama** - Local AI (NEW!)
- **PptxGenJS** - PowerPoint generation (NEW!)

## 📝 Environment Variables

```env
DATABASE_URL=mysql://user:password@localhost:3306/slides_db
JWT_SECRET=your-secret-key-here
PORT=3001

# AI Configuration (optional)
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

## 🧪 Testing

```bash
# Test AI generation
curl -X POST http://localhost:3001/ai/generate-slides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "topic": "AI in Education",
    "slideCount": 5,
    "tone": "professional",
    "language": "vi"
  }'
```

Hoặc mở file `test-ai-slides.html` trong browser.


