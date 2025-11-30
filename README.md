# 🎬 YouTube Content Downloader (YCD) — by OneTechly

**OneTechly** builds cloud-native SaaS solutions that help creators, developers, and businesses manage video content efficiently and securely.

**YouTube Content Downloader (YCD)** is a production-grade web application that enables users to:
- Extract **clean transcripts** (text & timestamped)
- Convert videos to **MP3 audio** with metadata
- Download **full videos** in multiple qualities

All wrapped with JWT authentication, Stripe subscriptions, usage tracking, and enterprise-grade security.

🌐 **Live App:** [https://onetechly.com/ycd](https://onetechly.com/ycd)  
🏢 **Company:** [https://onetechly.com](https://onetechly.com)  
📚 **API Docs:** [https://api.onetechly.com/docs](https://api.onetechly.com/docs)

---

## 🚀 Overview

YCD provides a complete SaaS experience with professional-grade infrastructure:

- **Frontend:** React 18 + Tailwind CSS (responsive, mobile-first design)
- **Backend:** FastAPI (Python) + SQLAlchemy ORM
- **Payments:** Stripe integration with webhooks and subscription management
- **Deployment:** Render cloud platform (automatic scaling)
- **Database:** PostgreSQL (production) / SQLite (development)
- **Security:** JWT authentication, CSP/HSTS headers, strict CORS policies
- **YouTube Access:** Mobile proxy + cookie rotation for reliable content extraction

---

## ✨ Features

| Category | Description |
|----------|-------------|
| 🧠 **Transcripts** | Clean and timestamped YouTube transcripts in TXT, SRT, VTT formats |
| 🎧 **Audio Downloads** | High-quality MP3 extraction with embedded metadata and cover art |
| 🎥 **Video Downloads** | Multi-quality MP4 downloads (360p, 720p, 1080p, 4K) |
| 🧾 **Subscriptions** | Stripe-powered tiered plans (Free, Pro, Premium) with usage limits |
| 🔒 **Authentication** | Secure JWT-based login with password reset via SendGrid |
| 📱 **Mobile-Optimized** | Fully responsive UI tested across iOS, Android, and desktop |
| 📊 **User Dashboard** | Real-time usage tracking, download history, and batch job management |
| ⚡ **Batch Processing** | Queue multiple downloads with Pro/Premium tier concurrency |
| ☁️ **Cloud-Native** | Auto-scaling deployment with zero-downtime updates |
| 🛡️ **Production Security** | CSP headers, HSTS enforcement, rate limiting, and input validation |
| 🌐 **Bot Detection Bypass** | DECODO mobile proxy + automated cookie rotation for 95%+ success rate |

---

## 🖼️ Screenshots

> **Note:** Images use absolute GitHub URLs for consistent display across all platforms and devices.

### 🌐 OneTechly Homepage
*Professional SaaS landing page with modern UI components and clear value proposition.*

![OneTechly Homepage](https://raw.githubusercontent.com/Ambro19/onetechly-frontend/main/public/readme-assets/onetechly-home.png)

---

### 🎯 Product Landing — YouTube Content Downloader
*Clean, branded entry point for users to sign in or create a new account.*

![YCD Landing Page](https://raw.githubusercontent.com/Ambro19/onetechly-frontend/main/public/readme-assets/ycd-landing.png)

---

### 📊 Dashboard Page
*Modern user dashboard with subscription status, usage analytics, and activity logs.*

![YCD Dashboard](https://raw.githubusercontent.com/Ambro19/onetechly-frontend/main/public/readme-assets/ycd-dashboard.png)

---

## ⚙️ Installation

### Prerequisites

- **Node.js** v16+ ([Download](https://nodejs.org/))
- **Python** 3.9+ ([Download](https://www.python.org/downloads/))
- **PostgreSQL** 14+ for production ([Download](https://www.postgresql.org/download/))
- **Stripe Account** for payment processing ([Sign up](https://stripe.com))
- **DECODO Account** for mobile proxy (optional but recommended) ([Sign up](https://decodo.io))

---

### 📱 Frontend Setup

```bash
# Clone repository
git clone https://github.com/Ambro19/onetechly-frontend.git
cd onetechly-frontend

# Install dependencies
npm install
```

**Create `.env` file in frontend root:**

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000

# Stripe (Test Keys)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Optional: Analytics
REACT_APP_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

**Start development server:**

```bash
npm start
```

**Frontend runs at:** `http://localhost:3000`

---

### 🔧 Backend Setup

```bash
# Clone repository
git clone https://github.com/Ambro19/onetechly-backend.git
cd onetechly-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Create `.env` file in backend root:**

```env
# ======================================
# DATABASE CONFIGURATION
# ======================================
DATABASE_URL=sqlite:///./youtube_trans_downloader.db

# ======================================
# JWT AUTHENTICATION
# ======================================
SECRET_KEY=your-secret-key-generate-with-secrets-token-urlsafe-64
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# ======================================
# STRIPE CONFIGURATION (Test Mode)
# ======================================
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_LOOKUP_KEY=pro_monthly
STRIPE_PREMIUM_LOOKUP_KEY=premium_monthly
STRIPE_PRO_PRODUCT_NAME=Pro Plan
STRIPE_PREMIUM_PRODUCT_NAME=Premium Plan

# ======================================
# YOUTUBE COOKIES (Base64 Encoded)
# ======================================
# Export cookies from Chrome using "Get cookies.txt LOCALLY" extension
# Convert to base64: python -c "import base64; print(base64.b64encode(open('youtube.com_cookies.txt', 'rb').read()).decode())"
YT_COOKIES_B64=<your_base64_encoded_cookies>

# ======================================
# DECODO MOBILE PROXY (Recommended)
# ======================================
# Enables 95%+ success rate by bypassing YouTube bot detection
# Sign up at: https://decodo.io
PROXY_ENABLED=true
PROXY_HOST=gate.decodo.com
PROXY_PORT=10001
PROXY_USERNAME=your_decodo_username
PROXY_PASSWORD=your_decodo_password

# ======================================
# EMAIL CONFIGURATION (SendGrid)
# ======================================
SENDGRID_API_KEY=SG.xxx
CONTACT_FROM=no-reply@onetechly.com
CONTACT_RECIPIENT=onetechly@gmail.com

# ======================================
# APPLICATION SETTINGS
# ======================================
ENVIRONMENT=development
FRONTEND_URL=http://localhost:3000
HOST=127.0.0.1
PORT=8000

# ======================================
# BATCH PROCESSING LIMITS
# ======================================
BATCH_PRO_MAX_LINKS=3
BATCH_PREMIUM_MAX_LINKS=1000
BATCH_MAX_JOBS_PER_USER=5
BATCH_MAX_CONCURRENCY_PRO=2
BATCH_MAX_CONCURRENCY_PREMIUM=8
```

**Start backend server:**

```bash
uvicorn main:app --reload
```

**Backend API runs at:** `http://localhost:8000`

**Interactive API documentation:** `http://localhost:8000/docs`

---

## 🌐 YouTube Cookie Setup (Critical for Reliability)

YouTube has aggressive bot detection. Fresh cookies are required for consistent downloads.

### **Step 1: Install Chrome Extension**

Install: [Get cookies.txt LOCALLY](https://chrome.google.com/webstore/detail/get-cookiestxt-locally)

### **Step 2: Export YouTube Cookies**

1. **Go to** [youtube.com](https://youtube.com)
2. **Login** to your Google account
3. **Watch 2-3 videos** (establishes normal browsing behavior)
4. **Click extension icon** → Select **Netscape format**
5. **Click "Export"** → Saves `youtube.com_cookies.txt` to Downloads

### **Step 3: Convert to Base64**

```powershell
# Windows PowerShell
cd backend
python -c "import base64; print(base64.b64encode(open('C:/Users/YOUR_USERNAME/Downloads/youtube.com_cookies.txt', 'rb').read()).decode(), end='')" > cookies_b64.txt

# Copy to clipboard
type cookies_b64.txt | clip

# Verify size (should be ~3000-5000 characters)
(Get-Content cookies_b64.txt).Length
```

```bash
# macOS/Linux
cd backend
python3 -c "import base64; print(base64.b64encode(open('~/Downloads/youtube.com_cookies.txt', 'rb').read()).decode())" > cookies_b64.txt

# Copy to clipboard
cat cookies_b64.txt | pbcopy  # macOS
cat cookies_b64.txt | xclip -selection clipboard  # Linux

# Verify size
wc -c cookies_b64.txt
```

### **Step 4: Add to Environment**

**Local (.env file):**
```env
YT_COOKIES_B64=<paste_base64_string_here>
```

**Production (Render Dashboard):**
1. Go to Service → Environment
2. Find `YT_COOKIES_B64` variable
3. Click Edit → Paste new value
4. Save Changes (triggers auto-redeploy)

### **🔄 Cookie Refresh Schedule**

- **Recommended:** Refresh every 7-14 days
- **Signs cookies expired:** "Sign in to confirm you're not a bot" errors
- **Best practice:** Set calendar reminder to refresh bi-weekly

---

## 🚀 Production Deployment (Render)

### Prerequisites

1. **Render Account:** [Sign up](https://dashboard.render.com)
2. **GitHub Repository:** Connect your repos
3. **Stripe Account:** Live mode configured
4. **DECODO Account:** Mobile proxy subscription (2GB plan recommended)

---

### 📊 PostgreSQL Database Setup

#### **Create Database Instance**

1. **Login to** [Render Dashboard](https://dashboard.render.com)
2. **Click** "New +" → Select "PostgreSQL"
3. **Configure:**
   - **Name:** `ycd-production-db`
   - **Region:** Same as backend service (lower latency)
   - **Plan:** Starter ($7/month minimum for production)
4. **Click** "Create Database"
5. **Copy** Internal Database URL from Info tab
   - Format: `postgresql://user:password@host:5432/dbname`

---

### 🎨 Frontend Deployment

#### **Create Static Site**

1. **New +** → Select **"Static Site"**
2. **Connect** GitHub repository: `onetechly-frontend`
3. **Configure Build Settings:**
   - **Build Command:** `npm run build`
   - **Publish Directory:** `build`
   - **Branch:** `main`

#### **Environment Variables**

```env
REACT_APP_API_URL=https://your-backend-name.onrender.com
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

#### **Configure SPA Routing**

**Option A: Using `_redirects` file (Recommended)**

Create `public/_redirects` in your project:

```
/*  /index.html  200
```

This file is committed to version control and works automatically.

**Option B: Render Dashboard**

Navigate to: **Redirects/Rewrites** → Add Rule:
- **Source:** `/*`
- **Destination:** `/index.html`
- **Action:** `Rewrite`

⚠️ **Important:** Choose ONE method only. Do not configure in both places.

---

### ⚡ Backend Deployment

#### **Create Web Service**

1. **New +** → Select **"Web Service"**
2. **Connect** GitHub repository: `onetechly-backend`
3. **Configure Build Settings:**
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Branch:** `main`

#### **Production Environment Variables**

Add these to your Render backend service:

```env
# ======================================
# DATABASE (From PostgreSQL Instance)
# ======================================
DATABASE_URL=postgresql+psycopg2://user:password@host:5432/dbname

# ======================================
# JWT AUTHENTICATION
# ======================================
SECRET_KEY=<generate-with-python-secrets-token-urlsafe-64>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# ======================================
# STRIPE (LIVE KEYS FOR PRODUCTION)
# ======================================
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_LOOKUP_KEY=pro_monthly
STRIPE_PREMIUM_LOOKUP_KEY=premium_monthly
STRIPE_PRO_PRODUCT_NAME=Pro Plan
STRIPE_PREMIUM_PRODUCT_NAME=Premium Plan

# ======================================
# YOUTUBE COOKIES (CRITICAL)
# ======================================
YT_COOKIES_B64=<base64_encoded_cookies_from_chrome>

# ======================================
# DECODO MOBILE PROXY (REQUIRED)
# ======================================
PROXY_ENABLED=true
PROXY_HOST=gate.decodo.com
PROXY_PORT=10001
PROXY_USERNAME=<your_decodo_username>
PROXY_PASSWORD=<your_decodo_password>

# ======================================
# EMAIL (SendGrid)
# ======================================
SENDGRID_API_KEY=SG.xxx
CONTACT_FROM=no-reply@onetechly.com
CONTACT_RECIPIENT=onetechly@gmail.com

# ======================================
# APPLICATION SETTINGS (CRITICAL)
# ======================================
ENVIRONMENT=production
FRONTEND_URL=https://onetechly.com
HOST=0.0.0.0
PORT=8000

# ======================================
# BATCH PROCESSING
# ======================================
BATCH_PRO_MAX_LINKS=3
BATCH_PREMIUM_MAX_LINKS=1000
BATCH_MAX_JOBS_PER_USER=5
BATCH_MAX_CONCURRENCY_PRO=2
BATCH_MAX_CONCURRENCY_PREMIUM=8

# ======================================
# OPTIONAL INTEGRATIONS
# ======================================
ENABLE_WEBHOOKS=true
ENABLE_S3_DELIVERY=false
ENABLE_SLACK_ALERTS=false
```

#### **🔐 Security: Production Environment**

Setting `ENVIRONMENT=production` automatically enables:

- **CSP (Content Security Policy)** — Prevents XSS attacks
- **HSTS (HTTP Strict Transport Security)** — Enforces HTTPS-only
- **Strict CORS** — Blocks unauthorized cross-origin requests
- **Rate Limiting** — Protects against abuse

Only set to `production` after:
- ✅ SSL certificate is active
- ✅ Domain configured and working
- ✅ All features tested on production domain

---

## 🔧 Troubleshooting

### Common Issues

#### **Issue: "Sign in to confirm you're not a bot" errors**

**Cause:** Expired YouTube cookies or IP blocked

**Solution:**
1. Refresh cookies (see Cookie Setup section)
2. Verify `PROXY_ENABLED=true` in environment
3. Check DECODO proxy credentials are correct
4. Wait 30 minutes if rate-limited

---

#### **Issue: Blank page on `/app/download`**

**Cause:** Frontend routing not configured

**Solution:**
1. Check `public/_redirects` exists with content: `/*  /index.html  200`
2. Rebuild frontend: `npm run build`
3. Clear browser cache (Ctrl+Shift+R)
4. Check console for errors (F12 → Console)

---

#### **Issue: Audio/Video downloads fail with parse errors**

**Cause:** YouTube bot detection or outdated yt-dlp

**Solution:**
1. Update yt-dlp: `pip install --upgrade yt-dlp` (latest: 2025.11.12)
2. Verify proxy is active (check logs for "🌐 Using proxy" message)
3. Try transcript download instead (more reliable)
4. Test with different video ID

---

## 📚 API Documentation

Once the backend is running, visit:

- **Interactive Swagger UI:** `http://localhost:8000/docs`
- **ReDoc Alternative:** `http://localhost:8000/redoc`
- **Production API Docs:** `https://api.onetechly.com/docs`

### Key Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| **POST** | `/register` | Create new user account | No |
| **POST** | `/token` | Login and receive JWT token | No |
| **GET** | `/users/me` | Get current user profile | Yes |
| **POST** | `/download_transcript/` | Download transcript (TXT/SRT/VTT) | Yes |
| **POST** | `/download_audio/` | Convert video to MP3 | Yes |
| **POST** | `/download_video/` | Download video (MP4) | Yes |
| **POST** | `/batch/submit` | Create batch download job | Yes (Pro/Premium) |
| **POST** | `/webhook/stripe` | Handle Stripe events | No (Webhook) |
| **GET** | `/subscription_status` | Get user's subscription details | Yes |
| **GET** | `/health` | Service health check | No |

---

## 📊 Tech Stack

### Frontend
- **React 18** — Modern UI framework
- **React Router v6** — Client-side routing
- **Tailwind CSS** — Utility-first styling
- **Axios** — HTTP client
- **Stripe.js** — Payment UI

### Backend
- **FastAPI** — High-performance Python framework
- **SQLAlchemy** — SQL ORM
- **Pydantic** — Data validation
- **JWT** — Secure authentication
- **Stripe Python SDK** — Payments
- **yt-dlp** — YouTube extraction (v2025.11.12)
- **SendGrid** — Email delivery

### Infrastructure
- **Render** — Cloud hosting
- **PostgreSQL** — Production database
- **DECODO** — Mobile proxy network
- **GitHub** — Version control

---

## 🤝 Contributing

We welcome contributions!

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

MIT License. See [LICENSE](LICENSE) file for details.

---

## 📞 Support

- **Email:** onetechly@gmail.com
- **Website:** [https://onetechly.com](https://onetechly.com)
- **Issues:** [GitHub Issues](https://github.com/Ambro19/onetechly-frontend/issues)

---

## 🙏 Acknowledgments

- **FastAPI** — Incredible Python web framework
- **Render** — Seamless cloud deployment
- **Stripe** — Robust payment infrastructure
- **yt-dlp** — Reliable YouTube extraction
- **DECODO** — Enterprise mobile proxy network

---

<p align="center">
  <strong>Built with ❤️ by OneTechly</strong><br>
  <em>Empowering creators with professional-grade tools</em>
</p>

<p align="center">
  <a href="https://onetechly.com">Website</a> •
  <a href="https://onetechly.com/ycd">Live App</a> •
  <a href="https://api.onetechly.com/docs">API Docs</a> •
  <a href="mailto:onetechly@gmail.com">Contact</a>
</p>
