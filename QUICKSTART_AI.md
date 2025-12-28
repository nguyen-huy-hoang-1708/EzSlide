# 🚀 Quick Start - AI Slide Generation

Hướng dẫn nhanh để chạy tính năng tạo slides bằng AI local.

## ✅ Checklist

- [ ] Ollama đã được cài đặt
- [ ] Ollama service đang chạy
- [ ] Model đã được pull về
- [ ] Backend dependencies đã cài
- [ ] Backend đang chạy

## 📋 Các bước thực hiện

### 1. Cài đặt Ollama

**macOS:**
```bash
brew install ollama
```

**Kiểm tra version:**
```bash
ollama --version
```

### 2. Khởi động Ollama service

```bash
ollama serve
```

Giữ terminal này chạy, mở terminal mới cho các bước sau.

### 3. Pull model về máy

```bash
# Model khuyến nghị (3.8GB)
ollama pull llama3.2

# Hoặc model nhỏ hơn nếu máy yếu (1.5GB)
ollama pull llama3.2:1b
```

Đợi model download xong (có thể mất 5-10 phút).

**Kiểm tra:**
```bash
ollama list
```

Phải thấy model `llama3.2` trong danh sách.

### 4. Cài đặt Backend dependencies

```bash
cd backend
npm install
```

### 5. Chạy Backend

```bash
npm run dev
```

Backend sẽ chạy ở `http://localhost:3001`

### 6. Test thử

**Option A: Test bằng script**
```bash
cd backend
node src/scripts/test_ollama.js
```

**Option B: Test bằng curl**
```bash
# Health check
curl http://localhost:3001/ai/health

# Generate slides (cần token)
curl -X POST http://localhost:3001/ai/generate-slides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "topic": "AI trong giáo dục",
    "slideCount": 3,
    "tone": "professional",
    "language": "vi"
  }'
```

**Option C: Test bằng HTML form**
1. Mở file `test-ai-slides.html` trong trình duyệt
2. Login trước để có JWT token
3. Nhập thông tin và click "Generate Slides"

## 🔧 Troubleshooting

### "Cannot connect to Ollama"
```bash
# Kiểm tra Ollama có chạy không
curl http://localhost:11434

# Nếu không, start lại
ollama serve
```

### "Model not found"
```bash
# Kiểm tra model đã có chưa
ollama list

# Pull lại nếu chưa có
ollama pull llama3.2
```

### "AI generation timeout"
- Dùng model nhỏ hơn: `llama3.2:1b`
- Giảm số slide xuống (2-5 slides)
- Đợi thêm thời gian (lần đầu có thể mất 30-60s)

### "Port 3001 already in use"
```bash
# Tìm process đang dùng port
lsof -ti:3001

# Kill process đó
kill -9 $(lsof -ti:3001)

# Hoặc đổi port trong .env
PORT=3002
```

## 📊 Performance

| Model | Size | Speed | Quality |
|-------|------|-------|---------|
| llama3.2:1b | 1.5GB | ⚡⚡⚡ Fast | ⭐⭐ OK |
| llama3.2 | 3.8GB | ⚡⚡ Medium | ⭐⭐⭐ Good |
| mistral | 4.7GB | ⚡ Slow | ⭐⭐⭐⭐ Great |

**Khuyến nghị:** Dùng `llama3.2` cho cân bằng tốc độ + chất lượng.

## 🎯 Endpoints

### POST `/ai/generate-slides`
Tạo slides và export PPTX

**Request:**
```json
{
  "topic": "Chủ đề",
  "slideCount": 5,
  "tone": "professional",
  "language": "vi",
  "exportFormat": "pptx"
}
```

**Response:**
```json
{
  "success": true,
  "slides": [...],
  "file": {
    "filename": "presentation_xxx.pptx",
    "downloadUrl": "/uploads/presentations/...",
    "filepath": "..."
  }
}
```

### GET `/ai/health`
Kiểm tra Ollama status

**Response:**
```json
{
  "status": "healthy",
  "models": ["llama3.2:latest"]
}
```

## 📚 Tài liệu đầy đủ

Xem: [AI_INTEGRATION_GUIDE.md](./AI_INTEGRATION_GUIDE.md)

## 💬 Support

Nếu gặp vấn đề:
1. Kiểm tra logs ở terminal
2. Xem [Troubleshooting](#troubleshooting)
3. Đọc [AI_INTEGRATION_GUIDE.md](./AI_INTEGRATION_GUIDE.md)

---

**Happy Coding! 🎉**
