# Đưa ATVNCG.26 lên GitHub và xuất bản website

## 1. Chạy local với database lưu thật

Dự án dùng hai chế độ database:

- Local không có `DATABASE_URL`: SQLite tại `data/atvncg-local.sqlite` (tự tạo, dữ liệu tồn tại sau khi restart).
- Production có `DATABASE_URL`: PostgreSQL qua Prisma.

Trong PowerShell, chạy:

```powershell
cd E:\ATVNCG_Website
Copy-Item .env.example .env
pnpm.cmd install
pnpm.cmd dev
```

Nếu `.env` đã có sẵn thì không chạy lại lệnh `Copy-Item`. Mở `http://localhost:3000`. Trang admin là `http://localhost:3000/admin`.

Ở local, nếu chưa điền `ADMIN_PASSWORD`, mật khẩu dự phòng là:

```text
ATVNCG2026!admin
```

Để kiểm tra lưu thật: thêm một từ trong admin, dừng server bằng `Ctrl+C`, chạy lại `pnpm.cmd dev` và kiểm tra từ đó vẫn còn. File SQLite, `.env`, khóa bí mật và thư mục build đều đã được `.gitignore` loại khỏi GitHub.

## 2. Đưa mã nguồn lên GitHub

### Tạo repository trên GitHub

1. Đăng nhập `https://github.com`.
2. Nhấn dấu `+` ở góc trên bên phải → **New repository**.
3. Đặt tên, ví dụ `atvncg-2026`.
4. Chọn **Public** nếu muốn mọi người xem mã nguồn, hoặc **Private** nếu chỉ muốn website công khai.
5. Không chọn tạo README, `.gitignore` hay License vì dự án đã có các file này.
6. Nhấn **Create repository** và giữ trang Quick setup đang hiện URL repository.

### Khởi tạo Git và push lần đầu

Tại terminal PowerShell trong VS Code:

```powershell
cd E:\ATVNCG_Website
git init
git branch -M main
git config user.name "TEN_CUA_BAN"
git config user.email "EMAIL_GITHUB_CUA_BAN"
git add .
git status
git commit -m "Initial ATVNCG 2026 website"
git remote add origin https://github.com/TEN_GITHUB/atvncg-2026.git
git push -u origin main
```

Thay `TEN_CUA_BAN`, `EMAIL_GITHUB_CUA_BAN` và `TEN_GITHUB` bằng thông tin thật. Trước khi commit, kết quả `git status` **không được có** `.env` hoặc `data/atvncg-local.sqlite`.

Sau khi push, link dạng sau chỉ là nơi xem mã nguồn:

```text
https://github.com/TEN_GITHUB/atvncg-2026
```

## 3. Tạo PostgreSQL thật trên Neon

SQLite local không được push lên GitHub và không phù hợp với môi trường serverless. Website công khai cần PostgreSQL:

1. Mở `https://console.neon.tech`, đăng nhập và chọn **New Project**.
2. Đặt tên, ví dụ `atvncg-2026`; chọn region gần Việt Nam nếu có.
3. Trong project, nhấn **Connect**.
4. Bật **Connection pooling** và sao chép connection string. Nó có dạng:

```text
postgresql://USER:PASSWORD@EP-ENDPOINT-pooler.REGION.aws.neon.tech/neondb?sslmode=require
```

Không gửi chuỗi này cho người khác, không dán vào GitHub và không commit vào bất kỳ file nào.

## 4. Deploy Next.js lên Vercel

GitHub Pages chỉ phục vụ website tĩnh nên không chạy được API, admin, đăng nhập và database của dự án này. GitHub lưu mã nguồn; Vercel chạy website từ repository đó.

1. Mở `https://vercel.com/new` và đăng nhập bằng GitHub.
2. Cho phép Vercel truy cập repository `atvncg-2026`, rồi nhấn **Import**.
3. Framework Preset để **Next.js**, Root Directory để mặc định.
4. Mở **Environment Variables** và thêm:

| Tên biến | Giá trị |
| --- | --- |
| `DATABASE_URL` | Connection string Neon ở bước 3 |
| `ADMIN_PASSWORD` | Mật khẩu admin mạnh, ít nhất 12 ký tự |
| `ADMIN_SESSION_SECRET` | Chuỗi ngẫu nhiên dài tối thiểu 32 ký tự |
| `NEXT_PUBLIC_NEXT_EPISODE_AT` | Ví dụ `2026-09-19T20:00:00+07:00` |

Tạo `ADMIN_SESSION_SECRET` trong PowerShell bằng:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

Để các form Fan Frame, Fan Made và Fan Calls tải được ảnh, video và file minh chứng, cấu hình thêm bốn biến Cloudinary theo mục 5 bên dưới.

5. Nhấn **Deploy**. Lệnh `vercel-build` của dự án sẽ tự tạo Prisma Client, áp dụng migration vào Neon và build Next.js.
6. Khi trạng thái là **Ready**, nhấn **Visit**. Link công khai sẽ có dạng:

```text
https://atvncg-2026-TEN_TAI_KHOAN.vercel.app
```

Đây mới là link website để gửi cho mọi người. Kiểm tra `/fan-guide` và đăng nhập `/admin` bằng `ADMIN_PASSWORD` đã đặt trên Vercel.

## 5. Cấu hình Cloudinary để tải tệp

1. Đăng nhập `https://console.cloudinary.com` và tạo Product Environment nếu tài khoản chưa có.
2. Mở **Settings** → **API Keys**.
3. Sao chép `Cloud name`, `API Key` và `API Secret`. Không gửi hoặc commit `API Secret` lên GitHub.
4. Trong Vercel, mở project → **Settings** → **Environments** → **Production**. Nếu giao diện hiện mục **Environment Variables** riêng thì mở mục đó.
5. Thêm từng biến sau:

| Tên biến | Giá trị |
| --- | --- |
| `CLOUDINARY_CLOUD_NAME` | Cloud name |
| `CLOUDINARY_API_KEY` | API Key |
| `CLOUDINARY_API_SECRET` | API Secret |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cùng Cloud name ở dòng đầu |

Chọn áp dụng cho **Production** và **Preview**, rồi lưu. Dự án đang dùng signed upload nên không cần tạo unsigned upload preset.

6. Mở tab **Deployments**, chọn deployment mới nhất → menu ba chấm → **Redeploy**. Biến mới chỉ có hiệu lực ở deployment được tạo sau khi lưu.
7. Mở website, thử gửi một ảnh tại Fan Frame. Với Fan Made và Fan Calls, form sẽ tải hai tệp: media hiển thị công khai và minh chứng chỉ admin nhìn thấy.

## 6. Đổi tên website Vercel thành ATVNCG 2026 Fandom

Không cần sửa code hay đổi tên repository GitHub:

1. Vào Vercel → chọn project `atvncg-2026` → **Settings** → **General**.
2. Trong **Project Name**, đổi thành `atvncg2026fandom` và nhấn **Save**.
3. Mở **Deployments** và **Redeploy** deployment mới nhất, hoặc push một commit mới.
4. Sau khi trạng thái **Ready**, mở **Settings** → **Domains** để xem URL production. Nếu tên còn trống, URL mong muốn là `https://atvncg2026fandom.vercel.app`. Nếu đã có người dùng tên này, đặt `atvncg-2026-fandom`.
5. Cập nhật bookmark và link đã chia sẻ sang URL mới. GitHub auto-deploy vẫn giữ nguyên vì Vercel liên kết bằng Project ID.

## 7. Cập nhật website ở những lần sau

Sau mỗi lần sửa code và kiểm tra bằng `pnpm.cmd lint` + `pnpm.cmd build`:

```powershell
git add .
git status
git commit -m "Mo ta thay doi"
git push
```

Vercel theo dõi nhánh `main`, nên mỗi lần `git push` thành công sẽ tự build và cập nhật link `.vercel.app` hiện có.

## Lỗi thường gặp

- **Build báo `DATABASE_URL is required`**: biến chưa được thêm cho môi trường Production trên Vercel; thêm rồi Redeploy.
- **Migration không kết nối Neon**: kiểm tra connection string, đặc biệt mật khẩu và `sslmode=require`.
- **Admin local không thấy dữ liệu cũ**: bảo đảm đang chạy từ đúng thư mục; database nằm ở `E:\ATVNCG_Website\data\atvncg-local.sqlite`.
- **Ảnh/video cộng đồng không upload**: cấu hình đủ Cloudinary; ảnh đại diện YouTube và các tính năng văn bản vẫn hoạt động nếu chưa cấu hình Cloudinary.
