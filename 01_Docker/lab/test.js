// test.js - Bài test đơn giản cho ứng dụng
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/health',
  method: 'GET',
  timeout: 3000
};

console.log('🧪 Chạy test kiểm tra ứng dụng...');
console.log('---');

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (res.statusCode === 200 && json.status === 'ok') {
        console.log('✅ Test 1 PASSED: Health check trả về status 200 và {status: ok}');
        console.log('---');
        console.log('🎉 Tất cả test đều PASSED!');
        process.exit(0);
      } else {
        console.log('❌ Test 1 FAILED: Unexpected response', json);
        process.exit(1);
      }
    } catch (e) {
      console.log('❌ Test 1 FAILED: Invalid JSON response');
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.log('❌ Test 1 FAILED: Không kết nối được đến server.');
  console.log('   Hãy đảm bảo server đang chạy: npm start');
  process.exit(1);
});

req.end();
