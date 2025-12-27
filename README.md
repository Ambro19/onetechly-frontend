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
| 🌐 **Bot Detection Bypass** | DECODO mobile proxy + automated cookie rotation for high success rate |

---

## 🖼️ Screenshots

> **Note:** Images use absolute GitHub URLs for consistent display across all platforms and devices.

### 🎯 Product Landing — YouTube Content Downloader
*Clean, branded entry point for users to sign in or create a new account.*

![YCD Landing Page](https://raw.githubusercontent.com/Ambro19/onetechly-frontend/main/public/readme-assets/ycd-landing.png)

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

**Start development server (dev only):**

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
YT_COOKIES_B64=<your_base64_encoded_cookies>

# ======================================
# DECODO MOBILE PROXY (Recommended)
# ======================================
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

### 🎨 Frontend Deployment (Static Site)

This repo is deployed as a **Render Static Site**.

#### **Build Settings**

- **Build Command (recommended):** `npm ci && npm run build`
- **Publish Directory:** `build`
- **Branch:** `main`

✅ **In production you should deploy the built output (`build/`). `npm start` is development-only and should not be used for production hosting.**

#### **SPA Routing (Refresh Fix)**

React Router routes like `/ycd`, `/pricing`, `/legal/terms` need SPA rewrites so refresh + shared links work.

**Choose ONE method only (single source of truth):**

**Option A (Recommended): `_redirects` file in repo**

Create `public/_redirects`:

```
/*  /index.html  200
```

CRA copies everything from `public/` into `build/`, so Render will apply it automatically.

**Option B: Render Dashboard Rule**

Redirects/Rewrites → Add:
- **Source:** `/*`
- **Destination:** `/index.html`
- **Action:** `Rewrite`

⚠️ **Do not keep both Option A and Option B enabled.**

---

### ⚡ Backend Deployment (Web Service)

1. Create a Render Web Service for the backend repo
2. **Start command:**

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

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
```

---

## ✅ Production Verification Checklist

After a deploy, validate like a real user:

1. **Open these routes directly in a new tab (not via navbar):**
   - `/ycd`
   - `/pricing`
   - `/legal/terms`

2. **Hard refresh each page:**
   - Windows: `Ctrl + Shift + R`
   - macOS: `Cmd + Shift + R`

3. **Copy/paste a deep link into a different browser or incognito window**

4. **Confirm the response is 200 and renders the SPA (not a blank page / 404)**

5. **Open DevTools → Console and confirm no runtime errors**

6. **Confirm API connectivity:**
   - login/register
   - subscription status
   - transcript/audio/video request

---

## 🔧 Troubleshooting

### **Blank page on refresh**

- Verify SPA rewrite is enabled (either `_redirects` OR Render rule)
- Confirm destination is exactly `/index.html` (not `/*index.html`)

### **Build warnings / audit vulnerabilities**

- Prefer: `npm audit fix` then re-test
- Use `npm audit fix --force` only if you're ready to validate breaking changes
- ESLint warnings won't block deployment, but clean them for long-term maintainability

### **"Sign in to confirm you're not a bot" errors**

- Refresh cookies (see Cookie Setup section)
- Verify `PROXY_ENABLED=true` in environment
- Check DECODO proxy credentials are correct
- Wait 30 minutes if rate-limited

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
- **yt-dlp** — YouTube extraction
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
