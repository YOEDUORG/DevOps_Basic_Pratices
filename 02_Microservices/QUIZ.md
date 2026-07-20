# 📝 Quiz — Buổi 2: Microservices & Docker Compose

> Chọn **một** đáp án đúng nhất cho mỗi câu hỏi.

---

### Câu 1: Ưu điểm LỚN NHẤT của kiến trúc Microservices so với Monolith là gì?

- A. Code ít hơn
- B. Không cần database
- C. Có thể scale và deploy từng service độc lập
- D. Không cần Docker

---

### Câu 2: Docker Compose dùng để làm gì?

- A. Thay thế Dockerfile
- B. Định nghĩa và chạy hệ thống nhiều container cùng lúc
- C. Tạo Docker Image
- D. Kết nối với Docker Hub

---

### Câu 3: Trong Docker Compose, các container giao tiếp với nhau bằng cách nào?

- A. Bằng IP address cố định
- B. Bằng tên service được định nghĩa trong docker-compose.yml (DNS resolution)
- C. Bằng port mapping ra host
- D. Không thể giao tiếp với nhau

---

### Câu 4: `depends_on` trong Docker Compose có tác dụng gì?

- A. Đảm bảo service phụ thuộc đã sẵn sàng nhận request
- B. Đảm bảo container START theo đúng thứ tự, nhưng KHÔNG đảm bảo service bên trong đã ready
- C. Tự động cài đặt dependencies
- D. Kết nối container vào cùng một network

---

### Câu 5: Lệnh nào dùng để dừng tất cả container VÀ xóa luôn dữ liệu volume?

- A. `docker compose stop`
- B. `docker compose down`
- C. `docker compose down -v`
- D. `docker compose rm -f`

---

## ✅ Đáp Án

| Câu | Đáp án | Giải thích |
|-----|--------|-----------|
| 1 | **C** | Microservices cho phép scale riêng service bị quá tải, deploy độc lập mà không ảnh hưởng service khác |
| 2 | **B** | Docker Compose dùng file YAML để định nghĩa multi-container app, khởi chạy tất cả bằng 1 lệnh |
| 3 | **B** | Docker Compose tự tạo network nội bộ. Container gọi nhau qua tên service (ví dụ `redis_db:6379`) |
| 4 | **B** | depends_on chỉ đảm bảo thứ tự START, không đợi ready. Cần retry logic trong code ứng dụng |
| 5 | **C** | `docker compose down -v` dừng containers VÀ xóa volumes. Không có `-v` thì volumes được giữ lại |
