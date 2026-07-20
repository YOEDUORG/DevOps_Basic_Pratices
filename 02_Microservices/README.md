# Buổi 2: Kiến Trúc Phân Tán (Microservices) & Docker Compose (3 giờ)

> 🎯 **Mục tiêu:** Học viên nắm vững kiến trúc Microservices, thành thạo Docker Compose để quản lý hệ thống nhiều container, hiểu Docker Networking & Volumes.

---

## Phần 1 — Từ Monolith đến Microservices (0:00 - 0:45)

### 1.1. Recap Buổi 1 (5 phút)
- Docker Image vs Container
- Dockerfile & các lệnh quan trọng
- Docker Volume giữ dữ liệu bền vững

### 1.2. Bài toán thực tế: E-commerce Monolith bị quá tải

> Công ty bạn có 1 ứng dụng e-commerce viết bằng Node.js. Tất cả tính năng (Đăng nhập, Giỏ hàng, Thanh toán, Tìm kiếm) nằm trong **một codebase duy nhất**. Ngày Black Friday, lượng truy cập tăng gấp 10 lần. Chỉ module Thanh toán bị quá tải, nhưng bạn phải **scale toàn bộ ứng dụng** → Lãng phí tài nguyên!

### 1.3. Monolith vs Microservices

```
    MONOLITH                              MICROSERVICES
┌──────────────────┐        ┌──────────┐  ┌──────────┐  ┌──────────┐
│   Frontend       │        │ Frontend │  │ Frontend │  │ Frontend │
│   ────────────   │        └────┬─────┘  └────┬─────┘  └────┬─────┘
│   Đăng nhập      │             │              │              │
│   ────────────   │        ┌────▼─────┐  ┌────▼─────┐  ┌────▼─────┐
│   Giỏ hàng       │        │  Auth    │  │  Cart    │  │ Payment  │
│   ────────────   │        │ Service  │  │ Service  │  │ Service  │
│   Thanh toán     │        │ (Node.js)│  │ (Python) │  │  (Go)    │
│   ────────────   │        └────┬─────┘  └────┬─────┘  └────┬─────┘
│   Tìm kiếm      │             │              │              │
│   ────────────   │        ┌────▼─────┐  ┌────▼─────┐  ┌────▼─────┐
│   Database       │        │  Auth DB │  │  Cart DB │  │Payment DB│
└──────────────────┘        └──────────┘  └──────────┘  └──────────┘

❌ Scale = scale ALL          ✅ Scale từng service độc lập
❌ 1 lỗi = sập toàn bộ       ✅ 1 service lỗi, các service khác vẫn chạy
❌ Một ngôn ngữ duy nhất      ✅ Mỗi service dùng ngôn ngữ phù hợp nhất
```

### 1.4. So sánh chi tiết

| Tiêu chí | Monolith | Microservices |
|----------|----------|---------------|
| **Codebase** | 1 codebase duy nhất | Nhiều codebase nhỏ, độc lập |
| **Triển khai** | Deploy toàn bộ | Deploy từng service riêng |
| **Scaling** | Scale toàn bộ ứng dụng | Scale từng service cần thiết |
| **Ngôn ngữ** | Thường 1 ngôn ngữ | Mỗi service có thể dùng ngôn ngữ khác |
| **Độ phức tạp ban đầu** | Đơn giản | Phức tạp hơn |
| **Khi lỗi xảy ra** | Sập toàn bộ | Chỉ service lỗi bị ảnh hưởng |
| **Team** | 1 team lớn | Nhiều team nhỏ, độc lập |
| **Phù hợp** | Dự án nhỏ, startup giai đoạn đầu | Dự án lớn, nhiều team |

### 1.5. Communication Patterns

| Pattern | Mô tả | Ví dụ |
|---------|--------|-------|
| **Synchronous (REST/HTTP)** | Service A gọi trực tiếp Service B và **đợi** kết quả | Service Giỏ hàng gọi API Service Sản phẩm lấy giá |
| **Asynchronous (Message Queue)** | Service A gửi message vào hàng đợi, Service B xử lý **khi sẵn sàng** | Service Đơn hàng gửi event "Đơn mới" → Service Email xử lý gửi mail |

### 1.6. Case Study thực tế

- **Netflix:** 700+ microservices, mỗi team quản lý 1-2 services
- **Grab:** Chuyển từ monolith sang microservices khi scale lên triệu users
- **Shopee:** Mỗi tính năng (Flash Sale, Chat, Payment) là một service riêng

---

## Phần 2 — Docker Compose & Networking (0:55 - 1:25)

### 2.1. Docker Compose là gì?

Khi hệ thống có nhiều container, chạy thủ công từng lệnh `docker run` là bất khả thi. **Docker Compose** giải quyết bằng cách:
- Định nghĩa tất cả services trong **1 file duy nhất** (`docker-compose.yml`)
- Khởi chạy tất cả bằng **1 lệnh duy nhất** (`docker compose up`)
- Tự động tạo network để các container giao tiếp

### 2.2. Cấu trúc file docker-compose.yml

```yaml
services:           # Định nghĩa các container
  web_app:          # Tên service 1
    build: .        # Build từ Dockerfile
    ports:          # Ánh xạ port
      - "8080:3000"
    environment:    # Biến môi trường
      - NODE_ENV=production
    depends_on:     # Phụ thuộc service khác
      - redis_db
    restart: unless-stopped   # Tự khởi động lại khi crash
    networks:       # Kết nối vào network
      - app_network

  redis_db:         # Tên service 2
    image: redis:7-alpine    # Dùng image từ Docker Hub
    volumes:        # Lưu trữ dữ liệu bền vững
      - redis_data:/data
    networks:
      - app_network

volumes:            # Khai báo volumes
  redis_data:

networks:           # Khai báo networks
  app_network:
    driver: bridge
```

### 2.3. Docker Networking

```
┌─────────────── app_network (bridge) ───────────────┐
│                                                     │
│  ┌───────────────┐          ┌───────────────┐      │
│  │   web_app     │  ──────▶ │   mysql_db    │      │
│  │  (Node.js)    │  DNS:    │   (MySQL)     │      │
│  │  port: 3000   │ "mysql_db:3306"          │      │
│  └───────────────┘          └───────────────┘      │
│                                                     │
└─────────────────────────────────────────────────────┘
         │
    port 8080 (host)
```

> 💡 **Quan trọng:** Trong cùng một Docker network, các container gọi nhau bằng **tên service** thay vì IP. Ví dụ: `mysql://mysql_db:3306`

### 2.4. depends_on — Cẩn thận bẫy!

```yaml
depends_on:
  - mysql_db
```

> ⚠️ **Lưu ý:** `depends_on` chỉ đảm bảo container **START** theo thứ tự, KHÔNG đảm bảo service bên trong đã **READY**. MySQL container có thể đã start nhưng MySQL server cần thêm 10-15 giây để sẵn sàng nhận kết nối → Cần **retry logic** trong code ứng dụng!

### 2.5. Khởi tạo Database tự động với init.sql

```yaml
volumes:
  - ./init.sql:/docker-entrypoint-initdb.d/init.sql
```

> 💡 MySQL image hỗ trợ tự chạy các file `.sql` trong thư mục `/docker-entrypoint-initdb.d/` khi container được khởi tạo **lần đầu tiên**. Đây là cách chuẩn để tạo bảng và seed dữ liệu mẫu.

### 2.6. Các lệnh Docker Compose thường dùng

```bash
docker compose up -d          # Khởi chạy tất cả services (ngầm)
docker compose up --build     # Build lại image rồi chạy
docker compose down           # Dừng và xóa tất cả containers
docker compose ps             # Liệt kê services đang chạy
docker compose logs           # Xem log tất cả services
docker compose logs web_app   # Xem log của 1 service cụ thể
docker compose logs -f        # Follow log realtime
docker compose exec web_app sh  # Truy cập vào container
docker compose restart web_app  # Restart 1 service
docker compose up --scale web_app=3  # Chạy 3 instance của web_app
```

---

## Phần 3 — 🔧 Lab 2A: Hệ Thống Frontend → Backend → MySQL (1:35 - 2:15)

### Kiến trúc bài Lab

```
 Trình duyệt          Docker Host
     │            ┌────────────────────────────────────────┐
     │   :8080    │  ┌────────────┐    ┌────────────┐     │
     └───────────▶│  │  Frontend  │───▶│  Backend   │     │
                  │  │  (Nginx)   │    │  (Node.js) │────▶│ MySQL
                  │  │  :80       │    │  :3001     │     │ :3306
                  │  └────────────┘    └────────────┘     │
                  └────────────────────────────────────────┘
```

**Mô tả:** Ứng dụng **Bookmark Manager** với kiến trúc 3 tầng:
- **Frontend** (Nginx): Phục vụ giao diện HTML/CSS/JS + reverse proxy request `/api/` tới Backend
- **Backend** (Node.js): REST API — CRUD bookmarks
- **MySQL**: Lưu trữ dữ liệu

### Bước 1: Xem mã nguồn trong `lab/`

Cấu trúc thư mục:
```
lab/
├── docker-compose.yml        # 3 services: frontend + backend + mysql_db
├── frontend/
│   ├── index.html, style.css, app.js   # Giao diện web
│   ├── nginx.conf            # Serve static + proxy /api/ → backend
│   └── Dockerfile
├── backend/
│   ├── app.js                # Express API — CRUD bookmarks
│   ├── package.json          # Dependencies: express, mysql2
│   ├── Dockerfile
│   └── .dockerignore
└── mysql/
    └── init.sql              # Tạo bảng + 4 bookmark mẫu
```

**Điểm quan trọng cần phân tích:**

1. **Frontend `nginx.conf`** — Nginx vừa serve file tĩnh, vừa làm reverse proxy:
```nginx
location / {
    root /usr/share/nginx/html;      # Serve HTML/CSS/JS
}
location /api/ {
    proxy_pass http://backend:3001/api/;  # Proxy API tới Backend
}
```

2. **Backend `app.js`** — Kết nối MySQL bằng tên service `mysql_db` (DNS nội bộ), có retry logic vì MySQL cần 10-15s khởi động.

3. **`mysql/init.sql`** — Mount vào `/docker-entrypoint-initdb.d/` để MySQL tự chạy SQL khi khởi tạo lần đầu.

### Bước 2: Xem file docker-compose.yml

```yaml
services:
  mysql_db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: devops123
      MYSQL_DATABASE: bookmark_db
    volumes:
      - mysql_data:/var/lib/mysql
      - ./mysql/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - app_network

  backend:
    build: ./backend
    environment:
      - DB_HOST=mysql_db
      - DB_USER=root
      - DB_PASSWORD=devops123
      - DB_NAME=bookmark_db
    depends_on:
      - mysql_db
    networks:
      - app_network
    # KHÔNG expose port — Frontend sẽ proxy request tới

  frontend:
    build: ./frontend
    ports:
      - "8080:80"              # Port duy nhất expose ra bên ngoài
    depends_on:
      - backend
    networks:
      - app_network

volumes:
  mysql_data:

networks:
  app_network:
```

### Bước 3: Khởi chạy hệ thống

```bash
cd 02_Microservices/lab
docker compose up -d --build
```

> ⏳ **Lưu ý:** Lần đầu MySQL cần 15-30 giây để khởi tạo. Quan sát log để thấy retry logic hoạt động.

### Bước 4: Kiểm tra kết quả

```bash
# Xem status — phải thấy 3 container đang chạy
docker compose ps

# Xem log Backend — quan sát retry logic kết nối MySQL
docker compose logs -f backend

# Mở trình duyệt: http://localhost:8080
# → Giao diện Bookmark Manager hiện ra
# → Thử: Thêm bookmark → Lọc theo tag → Xóa bookmark

# Hoặc test bằng curl:
curl http://localhost:8080/api/health
curl http://localhost:8080/api/bookmarks

# Inspect network — xem 3 container cùng mạng
docker network ls
docker network inspect lab_app_network
```

---

## Phần 4 — 🔧 Lab 2B: Volume Persistence + Debug (2:15 - 2:35)

### 4.1. Demo Volume Persistence

```bash
# Thêm bookmark mới qua giao diện hoặc curl
curl -X POST http://localhost:8080/api/bookmarks \
  -H "Content-Type: application/json" \
  -d '{"title": "Kubernetes Docs", "url": "https://kubernetes.io", "tag": "devops"}'

# Kiểm tra — có 5+ bookmark
curl http://localhost:8080/api/bookmarks

# Tắt toàn bộ hệ thống
docker compose down

# Khởi động lại
docker compose up -d

# Bookmark VẪN CÒN nhờ Volume!
curl http://localhost:8080/api/bookmarks
```

> ✅ Dữ liệu MySQL lưu trong volume `mysql_data` → không mất khi container restart.

### 4.2. Demo mất dữ liệu khi xóa Volume

```bash
# Tắt hệ thống VÀ xóa volume
docker compose down -v

# Khởi động lại → Database tạo lại từ init.sql (chỉ còn 4 mẫu ban đầu)
docker compose up -d
curl http://localhost:8080/api/bookmarks
# → Bookmark tự thêm đã mất!
```

> ⚠️ Cờ `-v` trong `docker compose down -v` sẽ xóa luôn volumes. **Rất nguy hiểm trên Production!**

### 4.3. Truy cập vào MySQL container để debug

```bash
# Vào bên trong container MySQL
docker compose exec mysql_db mysql -uroot -pdevops123 bookmark_db

# Chạy SQL trực tiếp
SELECT * FROM bookmarks;
SELECT COUNT(*) FROM bookmarks;
exit
```

### 4.4. Dọn dẹp

```bash
docker compose down -v
```

---

## Phần 5 — 📝 Quiz & Mock Interview (2:45 - 3:00)

Xem file: **[QUIZ.md](./QUIZ.md)**

### Mini Mock Interview (5 phút)

Chia nhóm 2 người, luân phiên hỏi đáp:
1. "Giải thích sự khác biệt giữa Monolith và Microservices?"
2. "Trong Docker Compose, các container nói chuyện với nhau bằng cách nào?"
3. "depends_on có đảm bảo MySQL đã sẵn sàng không? Nếu không, giải pháp là gì?"
