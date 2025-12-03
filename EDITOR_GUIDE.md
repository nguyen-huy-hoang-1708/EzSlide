# 📝 EZSlide Editor - PowerPoint-like Editor Guide

## 🎯 Tổng quan

Editor mới đã được thiết kế giống PowerPoint với đầy đủ tính năng:
- ✅ Thêm và chỉnh sửa văn bản
- ✅ Thêm hình ảnh
- ✅ Thêm shapes (hình chữ nhật, tròn, tam giác, ngôi sao)
- ✅ Chỉnh background màu sắc hoặc ảnh
- ✅ Chỉnh font chữ (font family, size, weight, style, color, alignment)
- ✅ Xoay, resize, di chuyển elements
- ✅ Properties panel chi tiết
- ✅ Auto-save

## 🚀 Cách sử dụng

### 1. Truy cập Editor
```
http://localhost:3001/editor/{slideId}
```
hoặc tạo slide mới:
```
http://localhost:3001/editor/new
```

### 2. Toolbar chính (Top)

#### 📄 Document Controls
- **Back**: Quay lại dashboard
- **Title**: Click để đổi tên slide
- **Save**: Lưu slide và tất cả elements
- **Export**: Xuất slide (PDF/PPTX)
- **Start Presentation**: Bắt đầu trình chiếu

### 3. Toolbar công cụ (Main)

#### ➕ Add Elements
- **Add Text** (T icon): Thêm text box mới
  - Double-click text để chỉnh sửa nội dung
  - Hoặc dùng Properties Panel
  
- **Add Image** (📷 icon): Thêm ảnh
  - Nhập URL ảnh khi được hỏi
  
- **Add Shape** (🔷 icon): Dropdown menu
  - Rectangle
  - Circle
  - Triangle
  - Star

#### 🎨 Text Formatting (khi chọn text element)
- **Font Family**: Arial, Times New Roman, Courier New, Georgia, Verdana
- **Font Size**: 8-200px (số)
- **Bold** (B): Chữ đậm
- **Italic** (I): Chữ nghiêng
- **Color**: Chọn màu chữ
- **Alignment**: Left, Center, Right

#### 🔧 Element Controls (khi chọn element bất kỳ)
- **Rotation**: 0-360 độ
- **Delete**: Xóa element đang chọn

#### 🎨 Background
- **Background Color**: Chọn màu nền
- **Background Image URL**: Nhập URL ảnh nền

### 4. Canvas (Giữa màn hình)

#### Kích thước: 960x540px (16:9 ratio)

#### Thao tác với elements:
- **Click**: Chọn element (viền xanh)
- **Double-click** (text): Chỉnh sửa nội dung text
- **Drag**: Di chuyển element
- **Resize handles** (góc/cạnh): Thay đổi kích thước
- **Click vào canvas trống**: Bỏ chọn element

### 5. Properties Panel (Phải - khi chọn element)

#### Tất cả elements:
- **Position X, Y**: Vị trí chính xác
- **Width, Height**: Kích thước
- **Rotation**: Xoay (slider 0-360°)
- **Layer (Z-Index)**: Thứ tự lớp
- **Delete Element**: Nút xóa

#### Text elements:
- **Text Content**: Textarea để sửa nội dung

#### Shape elements:
- **Fill Color**: Màu tô
- **Opacity**: Độ trong suốt (0-100%)

### 6. Keyboard Shortcuts (Bottom bar)

Khi có element được chọn:
- **↑**: Di chuyển lên 10px
- **↓**: Di chuyển xuống 10px
- **←**: Di chuyển trái 10px
- **→**: Di chuyển phải 10px

## 📋 Workflow cơ bản

### Tạo slide mới:
1. Vào `/editor/new`
2. Thêm background (màu hoặc ảnh)
3. Thêm text boxes
4. Thêm hình ảnh/shapes
5. Chỉnh sửa formatting
6. Click **Save**

### Chỉnh sửa slide có sẵn:
1. Vào `/editor/{slideId}`
2. Click vào element để chọn
3. Dùng toolbar hoặc properties panel để chỉnh
4. Click **Save**

## 🎨 Tips & Tricks

### Text Elements:
- Double-click để sửa nhanh
- Dùng Properties Panel để sửa text dài
- Thử các font khác nhau
- Chỉnh alignment cho đẹp

### Images:
- Dùng picsum.photos cho ảnh demo: `https://picsum.photos/800/600`
- Hoặc unsplash: `https://source.unsplash.com/800x600/?nature`

### Shapes:
- Circle: width = height để tròn đều
- Chỉnh opacity để làm hiệu ứng overlay
- Xoay triangle để tạo mũi tên

### Background:
- Màu đơn sắc: Dùng color picker
- Ảnh: Nhập URL (auto cover & center)
- Kết hợp background + shapes + text để tạo design đẹp

### Layout:
- Dùng Position X/Y trong Properties Panel để căn chỉnh chính xác
- Dùng Z-Index để sắp xếp lớp
- Element trên cùng có Z-Index cao nhất

## 🔄 Auto-Save

Editor tự động save khi bạn click nút **Save**. Tất cả elements sẽ được lưu vào database.

## 🐛 Troubleshooting

### Elements không hiện:
- Kiểm tra Z-Index (có thể bị che phủ)
- Kiểm tra Position X/Y (có thể nằm ngoài canvas)
- Refresh trang

### Không save được:
- Kiểm tra console (F12)
- Đảm bảo backend đang chạy
- Kiểm tra token authentication

### Text không hiện sau khi double-click:
- Text có thể bị màu trùng với background
- Chọn element và đổi color trong toolbar

## 📊 Data Structure

### Element types:
```javascript
{
  id: number,
  type: 'text' | 'image' | 'shape',
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number,
  zIndex: number,
  data: {
    // Text
    text?: string,
    fontSize?: number,
    fontFamily?: string,
    fontWeight?: 'normal' | 'bold',
    fontStyle?: 'normal' | 'italic',
    color?: string,
    textAlign?: 'left' | 'center' | 'right',
    
    // Image
    imageUrl?: string,
    alt?: string,
    
    // Shape
    shape?: 'rectangle' | 'circle' | 'triangle' | 'star',
    fill?: string,
    stroke?: string,
    strokeWidth?: number,
    opacity?: number
  }
}
```

## 🎓 Examples

### Tạo slide title:
1. Add Text
2. Text: "Welcome to EZSlide"
3. Font Size: 48
4. Font Weight: Bold
5. Alignment: Center
6. Width: 800
7. Position X: 80, Y: 220

### Tạo image với caption:
1. Add Image (URL: picsum.photos/600/400)
2. Position: X=180, Y=100
3. Add Text
4. Text: "Beautiful landscape"
5. Position: X=180, Y=520

### Tạo shape overlay:
1. Background Image: (nature photo)
2. Add Shape → Rectangle
3. Width: 960, Height: 540 (full canvas)
4. Fill: #000000
5. Opacity: 0.4
6. Z-Index: 0 (để làm nền tối)
7. Add Text màu trắng lên trên

## 🚀 Future Features (có thể thêm)

- [ ] Drag to resize (hiện tại dùng input)
- [ ] Undo/Redo
- [ ] Copy/Paste elements
- [ ] Align guides
- [ ] Grid snapping
- [ ] Multiple selection
- [ ] Group elements
- [ ] Animations
- [ ] Transitions

---

**Enjoy creating beautiful slides! 🎨✨**
