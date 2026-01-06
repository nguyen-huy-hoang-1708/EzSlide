# Tính Năng: Cảnh Báo Thay Đổi Chưa Lưu

## 📋 Mô tả

Đã thêm hệ thống theo dõi và cảnh báo khi có thay đổi chưa lưu trong Editor, đảm bảo người dùng không mất dữ liệu khi:
- Chuyển sang slide khác
- Quay về Dashboard
- Đóng tab/refresh trang

## ✨ Các Tính Năng Đã Thêm

### 1. **Theo dõi thay đổi chưa lưu**
- Tự động phát hiện khi user chỉnh sửa:
  - Thêm/xóa/sửa elements (text, image, shape)
  - Thay đổi background hoặc background image
  - Sửa tiêu đề slide

### 2. **Hiển thị trạng thái "Chưa Lưu"**
- Badge màu cam với icon cảnh báo khi có thay đổi chưa lưu
- Nút "保存" (Lưu) sẽ:
  - **Màu xanh lá** với shadow khi có thay đổi chưa lưu
  - **Màu xám** khi không có thay đổi

### 3. **Cảnh báo trước khi mất dữ liệu**

#### Khi chuyển slide:
```
保存されていない変更があります。

別のスライドに移動すると、変更が失われます。

続行しますか？
```
(Có thay đổi chưa lưu. Nếu chuyển slide khác, thay đổi sẽ mất. Tiếp tục?)

#### Khi quay về Dashboard:
```
保存されていない変更があります。

ダッシュボードに戻ると、変更が失われます。

続行しますか？
```
(Có thay đổi chưa lưu. Nếu quay về Dashboard, thay đổi sẽ mất. Tiếp tục?)

#### Khi đóng tab/refresh:
```
保存されていない変更があります。ページを離れますか？
```
(Có thay đổi chưa lưu. Rời khỏi trang?)

### 4. **Reset trạng thái sau khi lưu**
- Khi bấm "保存" thành công → reset cờ `hasUnsavedChanges`
- Khi load slide mới → reset cờ `hasUnsavedChanges`

## 🔧 Implementation Details

### State Management
```javascript
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
```

### Trigger Detection
```javascript
// Detect changes in elements, background, backgroundImage
useEffect(() => {
  if (slide) {
    setHasUnsavedChanges(true)
  }
}, [elements, background, backgroundImage])

// Detect title changes
onChange={(e) => {
  setSlide({...slide, title: e.target.value})
  setHasUnsavedChanges(true)
}}
```

### Browser beforeunload Hook
```javascript
useEffect(() => {
  const handleBeforeUnload = (e) => {
    if (hasUnsavedChanges) {
      e.preventDefault()
      e.returnValue = '保存されていない変更があります。ページを離れますか？'
      return e.returnValue
    }
  }

  window.addEventListener('beforeunload', handleBeforeUnload)
  return () => window.removeEventListener('beforeunload', handleBeforeUnload)
}, [hasUnsavedChanges])
```

## 🎯 User Flow

### Scenario 1: Chỉnh sửa và chuyển slide
1. User mở slide A
2. User thêm text element → Badge "未保存" xuất hiện
3. User click sang slide B → Dialog cảnh báo
4. User chọn "Cancel" → Ở lại slide A
5. User bấm "保存" → Toast success, badge biến mất
6. User click sang slide B → Chuyển slide ngay lập tức (không cảnh báo)

### Scenario 2: Chỉnh sửa và quay về Dashboard
1. User chỉnh sửa slide → Badge "未保存" xuất hiện
2. User click "← 戻る" → Dialog cảnh báo
3. User chọn "Cancel" → Ở lại Editor
4. User bấm "保存" → Badge biến mất
5. User click "← 戻る" → Quay về Dashboard ngay (không cảnh báo)

### Scenario 3: Chỉnh sửa và đóng tab
1. User chỉnh sửa slide → Badge "未保存" xuất hiện
2. User đóng tab/refresh → Browser warning popup
3. User chọn "Leave" → Tab đóng, mất thay đổi
4. User chọn "Stay" → Ở lại trang

## 📝 Code Changes

### Files Modified
- `frontend/src/pages/EditorNew.jsx`

### Key Changes
1. Added `hasUnsavedChanges` state
2. Added useEffect to track element/background changes
3. Added beforeunload event listener
4. Modified `switchToSlide()` to check unsaved changes
5. Modified "← 戻る" button to confirm before leaving
6. Modified "保存" button styling based on unsaved state
7. Added unsaved indicator badge in toolbar
8. Reset flag in `loadSlide()` and `saveSlide()`

## ✅ Testing Checklist

- [x] Badge "未保存" hiển thị khi có thay đổi
- [x] Badge biến mất sau khi lưu
- [x] Cảnh báo khi chuyển slide với thay đổi chưa lưu
- [x] Cảnh báo khi quay về Dashboard với thay đổi chưa lưu
- [x] Cảnh báo browser khi đóng tab/refresh
- [x] Không cảnh báo khi không có thay đổi
- [x] Nút "保存" đổi màu theo trạng thái

## 🎨 UI/UX Improvements

### Trước
- Không biết liệu slide đã được lưu hay chưa
- Dễ mất dữ liệu khi chuyển slide/thoát editor
- Nút "Lưu" luôn màu xanh (không phân biệt trạng thái)

### Sau
- ✅ Visual feedback rõ ràng (badge "未保存")
- ✅ Cảnh báo trước khi mất dữ liệu
- ✅ Nút "Lưu" thay đổi màu sắc theo trạng thái
- ✅ Bảo vệ dữ liệu người dùng tốt hơn

## 🚀 Future Enhancements

Có thể cân nhắc thêm:
1. **Auto-save**: Tự động lưu sau mỗi 30 giây nếu có thay đổi
2. **Local Storage backup**: Lưu thay đổi vào localStorage để phục hồi khi crash
3. **Undo/Redo**: Cho phép hoàn tác thay đổi
4. **Version history**: Lưu lịch sử các phiên bản slide
5. **Collaborative editing**: Cảnh báo khi nhiều người cùng chỉnh sửa

## 📌 Notes

- Tính năng này chỉ áp dụng cho EditorNew.jsx
- Không ảnh hưởng đến các trang khác (Dashboard, Presentations, etc.)
- Browser beforeunload dialog không thể customize text trong một số browser hiện đại (Chrome, Firefox) vì lý do bảo mật
