# Network Diagnostic & Device Info Utility

A professional demo showcasing how to gather device telemetry and network metadata for diagnostic purposes.

## 🚀 Features
- **Device Metrics:** Collect hardware concurrency, RAM estimates, and platform info.
- **Network Diagnostic:** Real-time IP and location verification (requires user consent).
- **Notification Integration:** Support for alerting via webhooks (e.g., Telegram).
- **Responsive UI:** Clean, modern interface designed for cross-device compatibility.

## ⚙️ Setup & Deployment

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- A Telegram Bot Token and Chat ID (for receiving alerts).

### 2. Environment Configuration
Create a `.env` file in the root directory and add:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
PORT=10000
```
*Note: Never upload your `.env` file to public repositories.*

### 3. Running Locally
```bash
npm install
npm start
```
Visit `http://localhost:10000` to preview.

### 4. Deployment to Render
1. Create a new Web Service on [Render](https://render.com).
2. Connect your GitHub repository.
3. Add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` as Environment Variables in the Render dashboard.
4. The service will automatically deploy using the provided `render.yaml`.

## 📜 Ethical Use
This tool is intended for educational purposes and system administration demos. Always ensure you have explicit consent before collecting user data.
