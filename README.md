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

## 🚀 Hướng dẫn Sử dụng (Ví dụ cho Buổi 2)

Để chạy thử hệ thống Microservices trong bài Lab 2, bạn chỉ cần thực hiện các bước sau:

1. Di chuyển vào thư mục bài Lab:
   ```bash
   cd 02_Microservices/lab/
   ```

2. Khởi chạy toàn bộ hệ thống dưới nền (background):
   ```bash
   docker compose up -d --build
   ```

3. Thử nghiệm tính năng **Load Balancing**:
   Scale ứng dụng Backend lên nhiều bản sao:
   ```bash
   docker compose up --scale backend=3 -d
   ```
   Sau đó, mở trình duyệt truy cập vào `http://localhost:8080/` để xem giao diện, hoặc gọi API sức khỏe của Backend để thấy sự phân bổ tải:
   ```bash
   for i in {1..10}; do curl -s http://localhost:8080/api/health; echo ""; sleep 0.2; done
   ```

4. Dọn dẹp hệ thống khi học xong:
   ```bash
   docker compose down -v
   ```

## 🔒 Ghi chú về Bảo mật
Trong các bài Lab này, mật khẩu cơ sở dữ liệu (`devops123`) được **cố tình cấu hình cứng (hardcoded)** để giúp học viên dễ dàng khởi chạy môi trường mà không cần thiết lập biến môi trường phức tạp. Tuyệt đối **không áp dụng** cách làm này cho các dự án thực tế chạy trên Production.
