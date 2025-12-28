# 🤖 Hướng dẫn tích hợp AI Local với Ollama

## Tổng quan

Backend đã được tích hợp **Ollama** (AI local) + **PptxGenJS** để tạo slides tự động:
- ✅ **Miễn phí & an toàn**: AI chạy hoàn toàn trên máy local, không gửi data ra ngoài
- ✅ **Tự động hóa**: AI viết nội dung, backend tạo file .pptx
- ✅ **Tương thích**: File .pptx mở được trên PowerPoint, Keynote, LibreOffice, Google Slides

## Kiến trúc

```
User Request (topic, slideCount, tone, language)
    ↓
Backend API (/ai/generate-slides)
    ↓
OllamaService → Gọi AI local (localhost:11434)
    ↓
AI trả về JSON (slide plans)
    ↓
PptxService → Tạo file .pptx
    ↓
Trả file cho user download
```

## 📦 Cài đặt

### Bước 1: Cài đặt Ollama

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Windows:**
- Tải từ: https://ollama.com/download

### Bước 2: Khởi động Ollama service

```bash
ollama serve
```

Service sẽ chạy ở `http://localhost:11434`

### Bước 3: Pull model về máy

Khuyến nghị dùng model nhỏ và nhanh:

```bash
# Model tiếng Việt (3.8GB) - khuyến nghị
ollama pull llama3.2

# Hoặc model nhỏ hơn (1.5GB)
ollama pull llama3.2:1b

# Model tiếng Anh tốt (4.7GB)
ollama pull mistral
```

Kiểm tra model đã có:
```bash
ollama list
```

### Bước 4: Cài dependencies cho backend

```bash
cd backend
npm install
```

Dependencies mới đã được thêm:
- `ollama`: ^0.5.0 - Client để gọi Ollama API
- `pptxgenjs`: ^3.12.0 - Tạo file PowerPoint

### Bước 5: Cấu hình environment (optional)

Tạo hoặc cập nhật file `backend/.env`:

```env
# Ollama configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.2

# Server
PORT=3001
```

### Bước 6: Chạy backend

```bash
npm run dev
```

## 🧪 Test API

### 1. Kiểm tra Ollama health

```bash
curl http://localhost:3001/ai/health
```

Response mong đợi:
```json
{
  "status": "healthy",
  "models": ["llama3.2:latest"]
}
```

### 2. Generate slides (trả về PPTX)

```bash
curl -X POST http://localhost:3001/ai/generate-slides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "topic": "Trí tuệ nhân tạo trong giáo dục",
    "slideCount": 5,
    "tone": "professional",
    "language": "vi",
    "includeImages": false,
    "exportFormat": "pptx"
  }'
```

Response:
```json
{
  "success": true,
  "slides": [...],
  "file": {
    "filename": "presentation_1234567890.pptx",
    "downloadUrl": "/uploads/presentations/presentation_1234567890.pptx",
    "filepath": "/absolute/path/to/file.pptx"
  },
  "metadata": {
    "topic": "Trí tuệ nhân tạo trong giáo dục",
    "slideCount": 5,
    "tone": "professional",
    "language": "vi",
    "generatedAt": "2025-12-28T10:30:00.000Z"
  }
}
```

### 3. Generate slides (chỉ trả về JSON)

```bash
curl -X POST http://localhost:3001/ai/generate-slides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "topic": "Machine Learning Basics",
    "slideCount": 3,
    "tone": "casual",
    "language": "en",
    "exportFormat": "json"
  }'
```

## 📝 API Endpoints

### POST `/ai/generate-slides`
Tạo slides bằng AI và export ra PPTX

**Headers:**
- `Authorization: Bearer <token>` (required)
- `Content-Type: application/json`

**Body params:**
| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| topic | string | ✅ | - | Chủ đề presentation |
| slideCount | number | ❌ | 5 | Số slide (2-20) |
| tone | string | ❌ | professional | formal/casual/professional/creative |
| language | string | ❌ | vi | vi/en |
| includeImages | boolean | ❌ | false | Có đề xuất hình ảnh không |
| exportFormat | string | ❌ | pptx | pptx/json |

### GET `/ai/health`
Kiểm tra Ollama service

### POST `/ai/pull-model`
Pull model về máy (cần auth)

**Body:**
```json
{
  "modelName": "llama3.2"
}
```

## 🎨 Cấu trúc Slide Plans (JSON từ AI)

```json
{
  "slides": [
    {
      "slideNumber": 1,
      "title": "Tiêu đề chính",
      "bullets": ["Phụ đề hoặc mô tả ngắn"],
      "notes": "Ghi chú cho người thuyết trình",
      "imageHint": "Mô tả hình ảnh gợi ý (optional)"
    },
    {
      "slideNumber": 2,
      "title": "Nội dung chính",
      "bullets": [
        "Điểm 1",
        "Điểm 2", 
        "Điểm 3"
      ],
      "notes": "Speaker notes...",
      "imageHint": "Biểu đồ so sánh"
    }
  ]
}
```

## 🔧 Troubleshooting

### Lỗi: "Cannot connect to Ollama"

**Nguyên nhân:** Ollama service chưa chạy

**Giải pháp:**
```bash
# Kiểm tra Ollama có chạy không
curl http://localhost:11434

# Nếu không, start service
ollama serve
```

### Lỗi: "Model not found"

**Nguyên nhân:** Chưa pull model về máy

**Giải pháp:**
```bash
# Pull model mặc định
ollama pull llama3.2

# Hoặc thử model khác
ollama pull mistral
```

### Lỗi: "AI generation timeout"

**Nguyên nhân:** Model quá lớn, máy yếu, hoặc số slide quá nhiều

**Giải pháp:**
1. Dùng model nhỏ hơn: `llama3.2:1b`
2. Giảm số slide xuống (5-7 slides)
3. Tăng timeout trong code nếu cần

### File PPTX không mở được

**Nguyên nhân:** Lỗi trong quá trình tạo file

**Giải pháp:**
1. Kiểm tra logs server
2. Thử lại với `exportFormat: "json"` để debug
3. Kiểm tra quyền ghi vào folder `uploads/presentations/`

## 🚀 Performance Tips

1. **Dùng model phù hợp:**
   - Model nhỏ (1-2GB): Nhanh, đủ dùng cho nội dung đơn giản
   - Model trung (3-4GB): Cân bằng tốc độ & chất lượng ✅
   - Model lớn (7GB+): Chất lượng cao nhưng chậm

2. **Tối ưu số slide:**
   - 3-5 slides: Rất nhanh (5-10s)
   - 5-10 slides: Chấp nhận được (10-30s)
   - 10+ slides: Có thể lâu (30s-2 phút)

3. **Cache results:**
   - Lưu slide plans vào database
   - Tái sử dụng cho các lần sau

## 📚 Tài liệu tham khảo

- [Ollama Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [PptxGenJS Documentation](https://gitbrent.github.io/PptxGenJS/)
- [Available Ollama Models](https://ollama.com/library)

## 🔐 Bảo mật

✅ **An toàn vì:**
- AI chạy hoàn toàn local, không gửi data ra internet
- Không cần API key hay subscription
- Không lưu logs request lên cloud
- File PPTX được tạo local, không qua third-party

❗ **Lưu ý:**
- Đảm bảo Ollama chỉ bind localhost (không expose ra public)
- Xóa file PPTX sau khi user download (nếu cần)
- Rate limit endpoint để tránh spam

## 🎯 Roadmap

- [ ] Tích hợp với hệ thống templates có sẵn
- [ ] Hỗ trợ thêm hình ảnh từ Unsplash/Pexels API
- [ ] Export thêm format PDF
- [ ] Streaming response để realtime feedback
- [ ] Custom theme colors từ frontend
- [ ] Multi-language support (thêm Nhật, Hàn,...)

---

**Made with ❤️ by EzSlide Team**
