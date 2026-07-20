const express = require('express');
const app = express();
const port = 3000;

// Route chính - Trang chào mừng + thông tin server
app.get('/', (req, res) => {
  const serverInfo = {
    message: 'Hello DevOps Learners! 🚀',
    description: 'Ứng dụng Node.js đã chạy thành công trong Docker Container!',
    hostname: require('os').hostname(),
    platform: process.platform,
    nodeVersion: process.version,
    uptime: `${Math.floor(process.uptime())} giây`
  };
  res.json(serverInfo);
});

// Health check endpoint - Dùng để kiểm tra sức khỏe container
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Endpoint hiển thị thông tin môi trường
app.get('/env', (req, res) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV || 'development',
    APP_VERSION: process.env.APP_VERSION || '1.0.0'
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ App đang chạy tại http://localhost:${port}`);
  console.log(`📋 Health check: http://localhost:${port}/health`);
});
