# 🎨 Frontend AI Integration Guide

## Đã tích hợp AI vào Frontend

### ✅ Những thay đổi

#### 1. Trang GenerateAI (`/ai`)
- ✅ Giao diện hoàn toàn mới, hiện đại
- ✅ Health check Ollama realtime
- ✅ Form đầy đủ: topic, slideCount, tone, language, exportFormat
- ✅ Auto-download file PPTX khi generate xong
- ✅ Preview slides với UI đẹp
- ✅ Hỗ trợ export JSON hoặc PPTX
- ✅ Error handling và loading states đầy đủ

#### 2. Navigation
- ✅ **Sidebar**: Thêm menu "🤖 AIスライド" với badge "NEW"
- ✅ **Topbar**: Nút "✨ AIで作成" đã link đến `/ai`

#### 3. Features
- ✅ Kiểm tra Ollama status khi load trang
- ✅ Hiển thị badge màu xanh/đỏ tùy Ollama status
- ✅ Auto-download PPTX sau khi generate
- ✅ Button "Tải lại" nếu muốn download lại
- ✅ Preview từng slide với bullets và notes
- ✅ Support cả tiếng Việt và English
- ✅ Validation input (topic required, slideCount 2-20)

### 🎯 User Flow

```
User click "AIで作成" → Trang /ai
    ↓
Nhập topic (VD: "AI trong giáo dục")
    ↓
Chọn options (slideCount, tone, language, format)
    ↓
Click "🚀 Tạo Slides với AI"
    ↓
Loading (10-30s)
    ↓
Success → Auto download .pptx + Preview slides
    ↓
User có thể "Tải lại" hoặc xem preview
```

### 📱 UI Components

#### Health Status Badge
```jsx
✅ Ollama is running (màu xanh)
❌ Ollama is not available (màu đỏ + hướng dẫn fix)
```

#### Form Controls
- **Topic**: Textarea lớn, placeholder gợi ý
- **Slide Count**: Input với nút +/- (2-20)
- **Tone**: Select (professional, formal, casual, creative)
- **Language**: Select (Tiếng Việt, English)
- **Export Format**: Select (PPTX, JSON)

#### Results Section
- Metadata box: topic, slideCount, tone, language
- Download button (màu xanh)
- Slides preview (cards với số thứ tự, title, bullets, notes)

### 🎨 Styling

**Colors:**
- Primary: Purple to Indigo gradient (`from-purple-500 to-indigo-600`)
- Success: Green (`bg-green-500`)
- Error: Red (`bg-red-50 text-red-700`)
- Status healthy: Green (`bg-green-500`)
- Status unhealthy: Red (`bg-red-500`)

**Icons:**
- 🤖 AI Slides
- 📝 Topic input
- 📊 Slide count
- 🎭 Tone
- 🌍 Language
- 💾 Export format
- ✅ Success
- ❌ Error
- 🚀 Generate button
- ⬇️ Download button

### 🔧 API Integration

**Endpoint:** `POST /ai/generate-slides`

**Request:**
```javascript
{
  topic: "Chủ đề",
  slideCount: 5,
  tone: "professional",
  language: "vi",
  includeImages: false,
  exportFormat: "pptx"
}
```

**Response:**
```javascript
{
  success: true,
  slides: [...],
  file: {
    filename: "presentation_xxx.pptx",
    downloadUrl: "/uploads/presentations/...",
    filepath: "..."
  },
  metadata: {
    topic: "...",
    slideCount: 5,
    tone: "professional",
    language: "vi",
    generatedAt: "2025-12-28T..."
  }
}
```

### 🧪 Testing

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Ollama:**
   ```bash
   ollama serve
   ```

3. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Test Flow:**
   - Login vào app
   - Click "AIで作成" ở header
   - Hoặc click "🤖 AIスライド" ở sidebar
   - Nhập topic: "Machine Learning cơ bản"
   - Chọn 5 slides, professional tone, Tiếng Việt
   - Click "🚀 Tạo Slides với AI"
   - Đợi 10-20s
   - File PPTX sẽ tự động download
   - Xem preview slides

### ⚠️ Error Handling

**Case 1: Ollama not running**
- Badge đỏ "❌ Ollama is not available"
- Hiện hướng dẫn: `ollama serve`
- Button generate bị disabled

**Case 2: Model not found**
- Error message: "model not found"
- Hướng dẫn: `ollama pull llama3.2`

**Case 3: Empty topic**
- Validation: "Vui lòng nhập chủ đề!"

**Case 4: Network error**
- Error message với chi tiết lỗi
- User có thể retry

### 🚀 Future Enhancements

- [ ] Save presentations to database
- [ ] Share presentations with link
- [ ] Edit generated slides inline
- [ ] Add images from Unsplash
- [ ] Custom theme colors
- [ ] Progress bar during generation
- [ ] Streaming response
- [ ] History of generated presentations
- [ ] Favorite/bookmark slides
- [ ] Export to PDF

### 📝 Code Structure

```
frontend/src/pages/GenerateAI.jsx
├── State management (useState)
├── Health check (useEffect)
├── Generate function
├── Download function
└── JSX
    ├── Status badge
    ├── Input form
    ├── Controls
    ├── Generate button
    ├── Results
    │   ├── Metadata
    │   ├── Download button
    │   └── Slides preview
    └── Help text
```

### 🎉 Demo

Xem video demo hoặc screenshots tại: `/docs/ai-demo/`

---

**Happy Presenting! 🚀**
