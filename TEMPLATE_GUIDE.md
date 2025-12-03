# 📚 EZSlide Templates Guide

## ✅ Available Templates (6 Total)

Mỗi template đã được thiết kế sẵn với slides hoàn chỉnh, bao gồm:
- Background colors/images
- Text elements với formatting
- Shapes và layouts chuyên nghiệp
- Ready to use - chỉ cần customize!

### 1. 💼 Business Pitch Deck
**Category:** Business  
**Slides:** 5 slides  

**Nội dung:**
1. **Cover Slide** - Title slide với company name
2. **Problem Statement** - Trình bày vấn đề thị trường
3. **Solution** - Giải pháp của bạn (với background image overlay)
4. **Market Opportunity** - Thống kê thị trường
5. **Business Model** - Revenue streams

**Màu chủ đạo:** #1a56db (blue), #ffffff (white), #f3f4f6 (gray)

---

### 2. 📚 Education Lecture
**Category:** Education  
**Slides:** 3 slides  

**Nội dung:**
1. **Course Title** - Tiêu đề khóa học
2. **Learning Objectives** - Mục tiêu học tập với bullet points
3. **Key Concepts** - Các khái niệm quan trọng

**Màu chủ đạo:** #059669 (green), #ffffff (white), #fef3c7 (yellow)

---

### 3. 📈 Marketing Strategy
**Category:** Marketing  
**Slides:** 3 slides  

**Nội dung:**
1. **Campaign Overview** - Tổng quan chiến dịch
2. **Target Audience** - Đối tượng mục tiêu với infographic
3. **Channels** - Các kênh marketing với icons

**Màu chủ đạo:** #dc2626 (red), #f59e0b (orange), #ffffff (white)

---

### 4. ⚪ Minimalist White
**Category:** Design  
**Slides:** 2 slides  

**Nội dung:**
1. **Minimal Title** - Clean title slide
2. **Content Slide** - Simple content với minimal design

**Màu chủ đạo:** #ffffff (white), #f3f4f6 (light gray), #000000 (black)

**Phong cách:** Minimal, clean, elegant

---

### 5. ⚫ Dark Mode
**Category:** Design  
**Slides:** 2 slides  

**Nội dung:**
1. **Dark Title** - Modern dark title
2. **Dark Content** - Feature highlight với dark theme

**Màu chủ đạo:** #1f2937 (dark gray), #374151 (gray), #ffffff (white)

**Phong cách:** Modern, premium, professional

---

### 6. 💻 Technical Report
**Category:** Technology  
**Slides:** 2 slides  

**Nội dung:**
1. **Technical Overview** - System architecture intro
2. **Stack Overview** - Technology stack với visual boxes

**Màu chủ đạo:** #0ea5e9 (blue), #64748b (gray), #f8fafc (light)

---

## 🎯 Cách sử dụng Templates

### Bước 1: Đăng nhập
```
URL: http://localhost:3001
Email: test@example.com
Password: Test@123
```

### Bước 2: Vào trang Templates
- Click "テンプレート" (Templates) trong sidebar
- Hoặc truy cập: `http://localhost:3001/templates`

### Bước 3: Chọn Template
1. Browse các templates theo category
2. Hover chuột lên template card
3. Click nút **"Use Template"** xuất hiện

### Bước 4: Tự động tạo Presentation
- System sẽ tự động:
  - Copy toàn bộ slides từ template
  - Copy tất cả elements (text, shapes, images)
  - Copy background settings
  - Tạo presentation mới cho bạn

### Bước 5: Edit trong Editor
- Tự động redirect đến Editor
- Customize text, colors, positions
- Thêm/xóa elements
- Save khi hoàn thành

## 🎨 Element Types trong Templates

### Text Elements
- Pre-formatted với font, size, color
- Có thể double-click để edit
- Dùng Properties Panel để điều chỉnh

### Shape Elements
- Circles, rectangles, triangles, stars
- Màu fill và opacity đã set sẵn
- Có thể resize và rotate

### Image Elements
- Background images cho slides
- Decorative images
- Từ picsum.photos

## 💡 Tips

### Customize Templates
1. **Text:** Double-click hoặc dùng Properties Panel
2. **Colors:** Click element → toolbar → color picker
3. **Position:** Drag hoặc nhập X/Y trong Properties
4. **Background:** Change trong top toolbar

### Best Practices
- Giữ nguyên layout cơ bản để đẹp
- Chỉ thay text content và images
- Sử dụng color palette của template
- Thêm slides mới nếu cần

### Common Uses
- **Business Pitch Deck:** Investor presentations
- **Education Lecture:** Classroom teaching
- **Marketing Strategy:** Campaign planning
- **Minimalist White:** Professional reports
- **Dark Mode:** Premium product launches
- **Technical Report:** Developer documentation

## 🔧 Troubleshooting

### "Failed to create presentation from template"
**Nguyên nhân:** Chưa login hoặc backend không chạy  
**Fix:**
```bash
# Check backend
curl http://localhost:4000/templates

# Restart backend
cd backend && npm start
```

### Template không có nút "Use Template"
**Nguyên nhân:** Frontend chưa load TemplateCard mới  
**Fix:** Hard refresh (Cmd+Shift+R) hoặc clear cache

### Slides trống sau khi use template
**Nguyên nhân:** Sample presentation không có elements  
**Fix:** Chạy seed lại:
```bash
cd backend
node src/scripts/seed.js
```

## 📊 Database Structure

```
Template (6 templates)
  └── Presentation (6 sample presentations)
        └── Slides (17 slides total)
              └── Elements (46 elements total)
```

Mỗi khi click "Use Template":
1. Tìm sample presentation của template đó
2. Clone toàn bộ slides
3. Clone toàn bộ elements của mỗi slide
4. Tạo presentation mới cho user

## 🚀 Next Steps

Sau khi tạo presentation từ template:
1. **Customize** content trong Editor
2. **Add more slides** nếu cần
3. **Save** presentation
4. **Export** to PDF/PPTX (coming soon)
5. **Present** to audience

---

**Happy Creating! 🎨✨**

Last updated: 2025-12-03
