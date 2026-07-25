// test.js - Test đơn giản cho CI pipeline
const app = require('./app');
const http = require('http');

let server;
let passed = 0;
let failed = 0;

async function runTests() {
  console.log('🧪 Bắt đầu chạy test suite...');
  console.log('================================');
  
  // Start server
  server = app.listen(3001);
  
  // Test 1: GET / returns 200
  await testEndpoint('GET /', 'http://localhost:3001/', 200);
  
  // Test 2: GET /health returns 200 with status ok
  await testEndpoint('GET /health', 'http://localhost:3001/health', 200);
  
  // Test 3: GET /nonexistent returns 404
  await testEndpoint('GET /404', 'http://localhost:3001/nonexistent', 404);
  
  console.log('================================');
  console.log(`📊 Kết quả: ${passed} passed, ${failed} failed`);
  
  server.close();
  
  if (failed > 0) {
    console.log('❌ Có test bị FAIL!');
    process.exit(1);
  } else {
    console.log('✅ Tất cả test đều PASSED!');
    process.exit(0);
  }
}

function testEndpoint(name, url, expectedStatus) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      if (res.statusCode === expectedStatus) {
        console.log(`  ✅ ${name} → ${res.statusCode} (expected ${expectedStatus})`);
        passed++;
      } else {
        console.log(`  ❌ ${name} → ${res.statusCode} (expected ${expectedStatus})`);
        failed++;
      }
      res.resume();
      resolve();
    }).on('error', () => {
      console.log(`  ❌ ${name} → Connection error`);
      failed++;
      resolve();
    });
  });
}

runTests();
