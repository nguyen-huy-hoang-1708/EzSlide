# Complete Database Setup Script

## 📋 Nội dung File

File `complete_database.sql` bao gồm **tất cả** những gì cần thiết để setup database từ đầu:

### 1️⃣ **Tạo Database**
- Drop database cũ (nếu có)
- Tạo database mới: `EZSlide`
- Cấu hình UTF-8MB4 (hỗ trợ tiếng Nhật)

### 2️⃣ **Tạo 7 Bảng**
```
User          - Người dùng (email, password, role, etc.)
Presentation  - Bản trình bày
Slide         - Slide trong bản trình bày
Element       - Thành phần trên slide (text, image, shape)
Template      - Template/mẫu thiết kế
Asset         - Tài nguyên (hình ảnh, icon)
_prisma_migrations - Quản lý migration
```

### 3️⃣ **Thiết lập Foreign Keys**
- Liên kết giữa các bảng
- Cascade delete rules
- Constraints

### 4️⃣ **Dữ liệu Sample**
- 2 người dùng test (test@example.com, admin@example.com)

### 5️⃣ **Chuyển đổi Tiêu đề sang Tiếng Nhật**
- Tất cả tiêu đề slide bằng tiếng Anh sẽ được chuyển sang tiếng Nhật
- Ví dụ:
  - "Course Introduction" → "コース紹介"
  - "What You Will Learn" → "学習内容"
  - "Phase 1: Frontend Fundamentals" → "フェーズ 1: フロントエンド基礎"
  - v.v.

---

## 🚀 Cách Sử Dụng

### Option 1: Sử dụng MySQL Command Line
```bash
cd /Users/mac/Desktop/BTL_ITSS/backend
mysql -u root -p'Vanthe@12345' < db/complete_database.sql
```

### Option 2: Sử dụng MySQL Workbench
1. Mở MySQL Workbench
2. Kết nối đến server
3. File → Open SQL Script → chọn `complete_database.sql`
4. Execute (Ctrl+Shift+Enter)

### Option 3: Sử dụng DBeaver
1. Mở DBeaver
2. Kết nối MySQL
3. File → Open SQL Script → chọn `complete_database.sql`
4. Execute (Ctrl+Enter)

---

## ✅ Verification

Sau khi chạy script, bạn sẽ thấy output:
```
Status
Database setup completed successfully!
TotalUsers
2
TotalPresentations
0
TotalSlides
0
TotalElements
0
TotalAssets
0
```

Hoặc verify thủ công:
```bash
mysql -u root -p'Vanthe@12345' EZSlide -e "SHOW TABLES;"
mysql -u root -p'Vanthe@12345' EZSlide -e "SELECT COUNT(*) as TotalUsers FROM User;"
```

---

## 🔧 Cấu trúc Bảng Chi Tiết

### User
```sql
id          | int (PRIMARY KEY)
email       | varchar (UNIQUE)
password    | varchar (hashed)
name        | varchar
role        | varchar (user/admin)
avatarUrl   | varchar
createdAt   | datetime
updatedAt   | datetime
```

### Presentation
```sql
id          | int (PRIMARY KEY)
userId      | int (FOREIGN KEY → User)
templateId  | int (FOREIGN KEY → Template)
title       | varchar
createdAt   | datetime
updatedAt   | datetime
```

### Slide
```sql
id              | int (PRIMARY KEY)
presentationId  | int (FOREIGN KEY → Presentation)
title           | varchar
content         | longtext (JSON format)
orderIndex      | int
userId          | int (FOREIGN KEY → User)
templateId      | int (FOREIGN KEY → Template)
createdAt       | datetime
updatedAt       | datetime
```

### Element
```sql
id          | int (PRIMARY KEY)
slideId     | int (FOREIGN KEY → Slide)
type        | varchar (text/image/shape)
x           | double (position)
y           | double (position)
width       | double
height      | double
rotation    | double
zIndex      | int
data        | JSON
createdAt   | datetime
updatedAt   | datetime
```

### Template
```sql
id          | int (PRIMARY KEY)
name        | varchar
category    | varchar
thumbnail   | varchar
data        | varchar (JSON format)
```

### Asset
```sql
id          | int (PRIMARY KEY)
userId      | int (FOREIGN KEY → User)
url         | varchar
filename    | varchar
createdAt   | datetime
```

---

## 📝 Lưu Ý

1. **Password hashing**: Mật khẩu trong sample data không hashed thực sự - cần update bằng bcrypt khi sử dụng
2. **Database name**: Mặc định là `EZSlide` (có thể thay đổi trong dòng CREATE DATABASE)
3. **Charset**: UTF-8MB4 hỗ trợ đầy đủ tiếng Nhật và emoji
4. **Collation**: utf8mb4_unicode_ci cho sắp xếp unicode đúng

---

## ⚠️ Troubleshooting

### Lỗi "Access denied"
```bash
# Kiểm tra mật khẩu trong .env file
cat /Users/mac/Desktop/BTL_ITSS/backend/.env

# Sử dụng đúng mật khẩu
mysql -u root -p'Vanthe@12345' < db/complete_database.sql
```

### Lỗi "Database 'EZSlide' already exists"
Có 2 cách:
1. Script tự động drop database cũ (nếu chọn y)
2. Manually drop: `mysql -u root -p'Vanthe@12345' -e "DROP DATABASE EZSlide;"`

### Lỗi "Foreign key constraint fails"
Đảm bảo tất cả các bảng được tạo theo thứ tự đúng (script đã xử lý)

---

## 🎯 Next Steps

1. ✅ Database setup xong
2. Chạy Prisma migrations (nếu cần): `npx prisma migrate deploy`
3. Khởi động backend: `npm run dev` (trong folder `/backend`)
4. Khởi động frontend: `npm run dev` (trong folder `/frontend`)
5. Test login với test user:
   - Email: `test@example.com`
   - Password: `Test@123` (cần set lại trong code)

---

**Tạo bởi**: EZSlide Development Team
**Ngày cập nhật**: 6 tháng 1, 2026
**Version**: 1.0 - Complete Setup
