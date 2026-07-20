const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

const port = 3001;

// Cấu hình kết nối MySQL từ biến môi trường
const dbConfig = {
  host: process.env.DB_HOST || 'mysql_db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'devops123',
  database: process.env.DB_NAME || 'bookmark_db'
};

let pool;

// Kết nối MySQL với retry logic
async function connectWithRetry(maxRetries = 15, delay = 3000) {
  for (let i = 1; i <= maxRetries; i++) {
    try {
      pool = mysql.createPool(dbConfig);
      await pool.query('SELECT 1');
      console.log('✅ Kết nối MySQL thành công!');
      return;
    } catch (err) {
      console.log(`⏳ Lần thử ${i}/${maxRetries}: MySQL chưa sẵn sàng, thử lại sau ${delay/1000}s...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  console.error('❌ Không thể kết nối MySQL!');
  process.exit(1);
}

connectWithRetry();

const os = require('os');

// Health Check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    const containerId = os.hostname();
    console.log(`[Container: ${containerId}] Nhận request kiểm tra Health`);
    res.json({ status: 'ok', database: 'connected', container: containerId, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

// Lấy danh sách bookmark
app.get('/api/bookmarks', async (req, res) => {
  try {
    const { tag } = req.query;
    let query = 'SELECT * FROM bookmarks ORDER BY created_at DESC';
    let params = [];
    if (tag) {
      query = 'SELECT * FROM bookmarks WHERE tag = ? ORDER BY created_at DESC';
      params = [tag];
    }
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Thêm bookmark mới
app.post('/api/bookmarks', async (req, res) => {
  try {
    const { title, url, tag } = req.body;
    if (!title || !url) {
      return res.status(400).json({ error: 'title và url là bắt buộc' });
    }
    const [result] = await pool.query(
      'INSERT INTO bookmarks (title, url, tag) VALUES (?, ?, ?)',
      [title, url, tag || 'general']
    );
    res.status(201).json({ id: result.insertId, title, url, tag: tag || 'general' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Xóa bookmark
app.delete('/api/bookmarks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM bookmarks WHERE id = ?', [id]);
    res.json({ message: 'Đã xóa bookmark' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Backend API đang chạy tại http://localhost:${port}`);
});
