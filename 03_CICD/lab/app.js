const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from CI/CD Pipeline! 🚀',
    version: process.env.APP_VERSION || '1.0.0',
    hostname: require('os').hostname(),
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Export app for testing
module.exports = app;

// Only start server if run directly (not when imported for testing)
if (require.main === module) {
  app.listen(port, '0.0.0.0', () => {
    console.log(`✅ App đang chạy tại http://localhost:${port}`);
  });
}
