const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  const version = process.env.APP_VERSION || '1.0.0';
  const hostname = require('os').hostname();
  const timestamp = new Date().toISOString();

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DevOps Lab | CI/CD Pipeline Version</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
            color: #ffffff;
            overflow: hidden;
        }
        .circle {
            position: absolute;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(0,255,170,0.5), rgba(0,162,255,0.5));
            filter: blur(60px);
            animation: float 10s infinite ease-in-out alternate;
            z-index: 0;
        }
        .circle:nth-child(1) { width: 400px; height: 400px; top: -10%; left: -10%; }
        .circle:nth-child(2) { width: 500px; height: 500px; bottom: -20%; right: -10%; animation-delay: -5s; background: linear-gradient(135deg, rgba(255,0,128,0.3), rgba(128,0,255,0.3)); }

        @keyframes float {
            0% { transform: translateY(0) scale(1); }
            100% { transform: translateY(50px) scale(1.1); }
        }

        .container {
            position: relative;
            z-index: 1;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 3rem;
            width: 90%;
            max-width: 650px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            transform: translateY(20px);
            opacity: 0;
            animation: slideUp 0.8s forwards ease-out;
        }

        @keyframes slideUp { to { transform: translateY(0); opacity: 1; } }

        .badge {
            display: inline-block;
            padding: 6px 12px;
            background: rgba(0, 255, 170, 0.2);
            color: #00ffaa;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        h1 {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 1rem;
            background: linear-gradient(to right, #00ffaa, #00a2ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        p.subtitle {
            font-size: 1.1rem;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 2.5rem;
            line-height: 1.6;
        }

        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
        .info-card {
            background: rgba(0, 0, 0, 0.2);
            padding: 1.5rem;
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: transform 0.3s ease, background 0.3s ease;
        }
        .info-card:hover { transform: translateY(-5px); background: rgba(255, 255, 255, 0.05); }
        .info-label { font-size: 0.8rem; color: rgba(255, 255, 255, 0.5); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem; }
        .info-value { font-size: 1.2rem; font-weight: 600; word-break: break-all; }
        
        .footer { margin-top: 3rem; text-align: center; font-size: 0.9rem; color: rgba(255, 255, 255, 0.4); }
        .footer a { color: #00a2ff; text-decoration: none; transition: color 0.3s ease; }
        .footer a:hover { color: #00ffaa; }
    </style>
</head>
<body>
    <div class="circle"></div>
    <div class="circle"></div>

    <div class="container">
        <div class="badge">CI/CD Pipeline Lab</div>
        <h1>Deploy Thành Công! 🚀</h1>
        <h1>Deploy V1.1.4.3</h1>
        <p class="subtitle"> Ứng dụng này được tự động build và deploy 100% bằng GitHub Actions.</p>

        <div class="info-grid">
            <div class="info-card">
                <div class="info-label">App Version</div>
                <div class="info-value">v\${version}</div>
            </div>
            <div class="info-card">
                <div class="info-label">Container ID</div>
                <div class="info-value">\${hostname}</div>
            </div>
            <div class="info-card" style="grid-column: 1 / -1;">
                <div class="info-label">Last Updated (UTC)</div>
                <div class="info-value">\${timestamp}</div>
            </div>
        </div>
        
        <div class="footer">
            Built with ❤️ using <a href="https://nodejs.org" target="_blank">Node.js</a> & <a href="https://docker.com" target="_blank">Docker</a>
        </div>
    </div>
</body>
</html>
  `;

  res.send(html);
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
