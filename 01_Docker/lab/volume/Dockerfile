# ============================================
# Dockerfile - Tối ưu & Chuẩn Best Practice
# ============================================

# 1. NỀN TẢNG: Chọn hệ điều hành Linux 'alpine' siêu nhẹ (~5MB) thay vì Ubuntu (~70MB)
FROM node:18-alpine

# 2. MÔI TRƯỜNG: Báo cho Node.js biết đây là môi trường thật để tự động tối ưu hiệu năng
ENV NODE_ENV=production

# 3. THƯ MỤC ẢO: Tạo thư mục làm việc mặc định bên trong Container
WORKDIR /usr/src/app

# 4. BẢO MẬT: Chuyển quyền sở hữu thư mục cho user 'node' thay vì user 'root' mặc định
RUN chown -R node:node /usr/src/app

# 5. BẢO MẬT: Bắt buộc ứng dụng chạy bằng user 'node' hạn chế quyền lực (Chống hacker)
USER node

# 6. CACHING: Copy package.json trước. Nếu file này không đổi, Docker sẽ bỏ qua bước 7 ở những lần build sau!
COPY --chown=node:node package*.json ./

# 7. THƯ VIỆN: Cài đặt dependencies (bỏ qua devDependencies để tiết kiệm dung lượng)
RUN npm install --omit=dev

# 8. MÃ NGUỒN: Copy toàn bộ code từ máy thật vào trong Container
COPY --chown=node:node . .

# 9. TÀI LIỆU: Khai báo cổng 3000 (Phải khớp chính xác với cổng cấu hình trong code app.js)
EXPOSE 4000

# 10. KHỞI CHẠY: Lệnh sống còn chạy ngay khi Container khởi động
CMD ["node", "app.js"]
