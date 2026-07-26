# YOEDU - DevOps Basic Practices

Chào mừng bạn đến với kho lưu trữ bài tập thực hành dành cho khóa học **DevOps Cơ Bản** tại YOEDU. Kho lưu trữ này chứa toàn bộ mã nguồn, cấu hình Docker và các ứng dụng mẫu để học viên thực hành từng bước các kiến thức cốt lõi của DevOps.

## 📚 Cấu trúc Khóa học

Kho lưu trữ được chia thành các thư mục tương ứng với từng chủ đề bài học:

### 1. `01_Docker/` (Buổi 1: Nền tảng Docker)
Bài Lab giúp học viên làm quen với cách đóng gói ứng dụng (Containerization) và quản lý dữ liệu với Docker.
- **`lab/`**: Ứng dụng Node.js cơ bản, bao gồm Dockerfile và cấu hình `.dockerignore`.
- **`lab/volume/`**: Ứng dụng Node.js có sử dụng Docker Volume để ghi và lưu trữ log tĩnh.

### 2. `02_Microservices/` (Buổi 2: Kiến trúc Microservices & Docker Compose)
Bài Lab giả lập một hệ thống Microservices 4 tầng (4-tier architecture) bao gồm Gateway, Frontend, Backend và Database.
- **`lab/`**: Cấu hình `docker-compose.yml` để khởi chạy toàn bộ hệ thống bằng một lệnh duy nhất.
- **`lab/mysql/`**: Cấu hình khởi tạo dữ liệu tự động cho MySQL.
- **`lab/backend/`**: RESTful API viết bằng Node.js kết nối tới MySQL.
- **`lab/frontend/`**: Giao diện Web tĩnh HTML/JS/CSS phục vụ bởi Nginx.
- **`lab/ocelotgw/`**: API Gateway chuyên dụng viết bằng .NET 8 (Ocelot) để định tuyến (Routing) và chia tải (Load Balancing).

### 3. `03_CICD/` (Buổi 3: Tự Động Hóa với CI/CD Pipeline)
Bài Lab hướng dẫn xây dựng pipeline CI/CD hoàn chỉnh với GitHub Actions — tự động Build, Test và Push Docker Image lên Docker Hub.
- **`lab/`**: Ứng dụng Express.js đơn giản kèm test suite để kiểm tra API.
- **`lab/.github/workflows/`**: File workflow `main.yml` định nghĩa pipeline 2 jobs: Build & Test → Push Docker Image.
- **`lab/Dockerfile`**: Đóng gói ứng dụng thành Docker Image để push lên Docker Hub.

### 4. `04_EndToEnd_Interview/` (Buổi 4: Bài Tập Cuối Khóa & Phỏng Vấn)
Bài Lab cuối khóa tổng hợp toàn bộ kiến thức — xây dựng hệ thống Mini E-Commerce với kiến trúc 4 tầng, kết hợp luyện phỏng vấn DevOps.
- **`lab/`**: Cấu hình `docker-compose.yml` cho 4 services: API Gateway, Frontend, Backend, MySQL.
- **`lab/api-gateway/`**: Nginx Reverse Proxy điều phối traffic — cửa ngõ duy nhất của hệ thống.
- **`lab/backend/`**: RESTful API (Node.js) — CRUD Products & Cart Management.
- **`lab/frontend/`**: Giao diện E-Commerce tĩnh HTML/CSS/JS phục vụ bởi Nginx.
- **`lab/mysql/`**: Script SQL khởi tạo bảng `products` và `cart_items` tự động.
- **`Interview_Questions.md`**: Bộ 20 câu hỏi phỏng vấn DevOps cấp Junior kèm đáp án mẫu.

## 🚀 Hướng dẫn Sử dụng

### Buổi 1 — Docker

```bash
cd 01_Docker/lab
docker build -t my-node-app .
docker run -d -p 8080:3000 --name devops-app my-node-app
# Truy cập: http://localhost:8080
```

### Buổi 2 — Microservices

```bash
cd 02_Microservices/lab/
docker compose up -d --build
# Truy cập: http://localhost:8080
# Scale Backend: docker compose up --scale backend=3 -d
```

### Buổi 3 — CI/CD

```bash
cd 03_CICD/lab
# Tạo repo GitHub → Thêm Secrets (DOCKERHUB_USERNAME, DOCKERHUB_TOKEN)
# Copy code vào repo → Push lên main
git push -u origin main
# Xem tab Actions trên GitHub để theo dõi pipeline
```

### Buổi 4 — End-to-End

```bash
cd 04_EndToEnd_Interview/lab
docker compose up --build -d
# Truy cập: http://localhost (port 80 qua API Gateway)
# Test: curl http://localhost/api/products
```

### Dọn dẹp hệ thống

```bash
docker compose down -v
docker system prune -f
```

## 🔒 Ghi chú về Bảo mật
Trong các bài Lab này, mật khẩu cơ sở dữ liệu (`devops123`) được **cố tình cấu hình cứng (hardcoded)** để giúp học viên dễ dàng khởi chạy môi trường mà không cần thiết lập biến môi trường phức tạp. Tuyệt đối **không áp dụng** cách làm này cho các dự án thực tế chạy trên Production.
