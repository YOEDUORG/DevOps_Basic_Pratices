-- ============================================
-- init.sql — Khởi tạo Database cho Bookmark Manager
-- File này tự chạy khi MySQL container khởi tạo lần đầu
-- ============================================

CREATE TABLE IF NOT EXISTS bookmarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    tag VARCHAR(100) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dữ liệu mẫu
INSERT INTO bookmarks (title, url, tag) VALUES
('Docker Documentation', 'https://docs.docker.com', 'devops'),
('Node.js Official', 'https://nodejs.org', 'backend'),
('MDN Web Docs', 'https://developer.mozilla.org', 'frontend'),
('GitHub', 'https://github.com', 'tools');
