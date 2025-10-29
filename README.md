# 🎬 YouTube Content Downloader (YCD) — by OneTechly

**OneTechly** builds cloud-native SaaS solutions that simplify how creators, developers, and businesses manage content. **YouTube Content Downloader (YCD)** is a sleek, mobile-ready application that lets users extract clean YouTube transcripts, MP3 audio, or full video downloads — all within a secure, scalable, and subscription-enabled platform.

🌐 **Live App:** [https://onetechly.com/ycd](https://onetechly.com/ycd)  
🏢 **Company:** [https://onetechly.com](https://onetechly.com)

---

## 🚀 Overview

YCD provides a full-stack SaaS experience:

- **Frontend:** React + Tailwind (modern, responsive UI)
- **Backend:** FastAPI (Python) with SQLAlchemy ORM
- **Payments:** Stripe integration with webhooks
- **Deployment:** Render cloud platform
- **Database:** PostgreSQL (production) / SQLite (development)
- **Security:** JWT authentication, HTTPS, CSP/HSTS headers, and strict CORS

It's designed for simplicity, elegance, and reliability — with the same polish and professionalism you expect from a production-grade SaaS.

---

## ✨ Features

| Category | Description |
|-----------|-------------|
| 🧠 **Transcripts** | Clean and timestamped YouTube transcripts in multiple formats |
| 🎧 **Audio** | Convert videos to MP3 audio seamlessly |
| 🎥 **Video** | Download full YouTube videos |
| 🧾 **Subscriptions** | Stripe-powered Pro & Premium plans |
| 🔒 **Authentication** | Secure JWT-based login system |
| 📱 **Mobile-Ready** | Fully responsive and optimized for all screen sizes |
| 📊 **Dashboard** | Real-time usage tracking, batch jobs, and history logs |
| ☁️ **Scalable** | Cloud-native deployment, automatically managed by Render |
| 🔐 **Production Security** | CSP, HSTS, and strict CORS policies enabled |

---

## 🖼️ Screenshots

### 🌐 OneTechly Homepage
*Professional SaaS landing with modern UI components.*

![OneTechly Homepage](public/readme-assets/onetechly-home.png)

---

### 🎯 Product Landing — YouTube Content Downloader
*Clean, branded entry page for users to sign in or create an account.*

![YCD Landing Page](public/readme-assets/ycd-landing.png))

---

### 📊 Dashboard Page
*Modern user dashboard with subscription insights and activity logs.*

![YCD Dashboard](public/readme-assets/ycd-dashboard.png)

---

## ⚙️ Installation

### Prerequisites

- **Node.js** (v16+)
- **Python** (v3.9+)
- **PostgreSQL** (for production) or SQLite (for development)
- **Stripe Account** (for payment processing)

### Frontend Setup

```bash
git clone https://github.com/Ambro19/onetechly-frontend.git
cd onetechly-frontend
npm install
```

Create a `.env` file in the frontend root:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Start the development server:

```bash
npm start
```

The frontend will run at `http://localhost:3000`

### Backend Setup

```bash
git clone https://github.com/Ambro19/onetechly-backend.git
cd onetechly-backend
pip install -r requirements.txt
```

Create a `.env` file in the backend root:

```env
# Database
DATABASE_URL=sqlite:///./ycd.db

# JWT Authentication
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Stripe (Test Keys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_LOOKUP_KEY=pro_monthly
STRIPE_PREMIUM_LOOKUP_KEY=premium_monthly

# Application
ENVIRONMENT=development
FRONTEND_URL=http://localhost:3000
HOST=127.0.0.1
PORT=8000
```

Start the backend server:

```bash
uvicorn main:app --reload
```

The backend API will run at `http://localhost:8000`

---

## 🚀 Deployment

### Prerequisites on Render

1. **Create a Render account** at [render.com](https://render.com)
2. **Set up PostgreSQL database** (see Database Setup below)
3. **Connect your GitHub repositories** for automatic deployments

### Database Setup on Render

#### Creating a PostgreSQL Instance

1. Log into [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → Select **"PostgreSQL"**
3. Configure:
   - **Name:** `ycd-production-db`
   - **Region:** Same as your backend service (for lower latency)
   - **Plan:** Starter ($7/mo minimum for production)
4. Click **"Create Database"**
5. Copy the **Internal Database URL** from the Info tab
   - Format: `postgresql://user:password@host:5432/dbname`

### Frontend Deployment

1. Create a new **Static Site** on Render
2. Connect your frontend repository
3. Configure build settings:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `build`
4. Add environment variables:
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```
5. Configure SPA rewrites (choose ONE method):
   
   **Option A: Using `_redirects` file (Recommended)**
   - Create `public/_redirects` with content: `/*  /index.html  200`
   - This file lives in version control
   
   **Option B: Render Dashboard**
   - Navigate to Redirects/Rewrites settings
   - Add rule: Source `/*`, Destination `/index.html`, Action `Rewrite`

   ⚠️ **Important:** Choose ONE method only. Do not configure rewrites in both places.

### Backend Deployment

1. Create a new **Web Service** on Render
2. Connect your backend repository
3. Configure build settings:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add production environment variables (see section below)

### Production Environment Variables

Add these to your Render backend service:

```env
# Database (from PostgreSQL instance)
DATABASE_URL=postgresql+psycopg2://user:password@host:5432/dbname

# JWT Authentication
SECRET_KEY=<generate-64-random-characters>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Stripe (LIVE keys for production)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_LOOKUP_KEY=pro_monthly
STRIPE_PREMIUM_LOOKUP_KEY=premium_monthly
STRIPE_PRO_PRODUCT_NAME=Pro Plan
STRIPE_PREMIUM_PRODUCT_NAME=Premium Plan

# Batch Policies
BATCH_PRO_MAX_LINKS=3
BATCH_PREMIUM_MAX_LINKS=1000
BATCH_MAX_JOBS_PER_USER=5
BATCH_MAX_CONCURRENCY_PRO=2
BATCH_MAX_CONCURRENCY_PREMIUM=8

# Optional Integrations
ENABLE_WEBHOOKS=true
ENABLE_S3_DELIVERY=true
ENABLE_SLACK_ALERTS=true
ENABLE_SSO=true

# S3 Configuration (if using)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
S3_OUTPUT_BUCKET=
S3_OUTPUT_PREFIX=batches/

# Slack Alerts (if using)
SLACK_WEBHOOK_URL=

# Email (if using)
SENDGRID_API_KEY=
CONTACT_FROM=no-reply@onetechly.com
CONTACT_RECIPIENT=onetechly@gmail.com

# Application Settings (CRITICAL)
ENVIRONMENT=production
FRONTEND_URL=https://onetechly.com
HOST=0.0.0.0
PORT=8000
```

**🔐 Security Note:** Setting `ENVIRONMENT=production` automatically enables:
- **CSP (Content Security Policy)** — Prevents XSS attacks
- **HSTS (HTTP Strict Transport Security)** — Enforces HTTPS-only connections
- **Strict CORS** — Blocks unauthorized cross-origin requests

Only set `ENVIRONMENT=production` after:
- ✅ SSL certificate is active
- ✅ Domain is properly configured
- ✅ All features tested on production domain

---

## 🔐 Security Features

### Production Security Headers

When `ENVIRONMENT=production`, the backend automatically enforces:

#### CSP (Content Security Policy)
Prevents malicious script injection by whitelisting allowed resource sources:
```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://js.stripe.com
```

#### HSTS (HTTP Strict Transport Security)
Forces browsers to only connect via HTTPS:
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

#### Strict CORS
Only allows API requests from your frontend domain:
```python
CORS_ORIGINS = ["https://onetechly.com"]
```

---

## 📚 API Documentation

Once the backend is running, visit:
- **Interactive API Docs:** `http://localhost:8000/docs`
- **Alternative Docs:** `http://localhost:8000/redoc`

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create new user account |
| POST | `/auth/login` | Login and receive JWT token |
| GET | `/users/me` | Get current user profile |
| POST | `/transcripts/extract` | Extract YouTube transcript |
| POST | `/audio/convert` | Convert video to MP3 |
| POST | `/batch/create` | Create batch download job |
| POST | `/stripe/create-checkout-session` | Initialize Stripe payment |
| POST | `/stripe/webhook` | Handle Stripe events |

---

## 🧪 Testing

### Frontend Tests

```bash
npm test
```

### Backend Tests

```bash
pytest
```

---

## 📊 Tech Stack

### Frontend
- **React 18** — UI framework
- **React Router** — Client-side routing
- **Tailwind CSS** — Utility-first styling
- **Axios** — HTTP client
- **React Query** — Server state management

### Backend
- **FastAPI** — High-performance Python web framework
- **SQLAlchemy** — SQL ORM
- **Pydantic** — Data validation
- **JWT** — Secure authentication
- **Stripe Python SDK** — Payment processing
- **yt-dlp** — YouTube content extraction

### Infrastructure
- **Render** — Cloud platform for hosting
- **PostgreSQL** — Production database
- **GitHub** — Version control and CI/CD

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See `LICENSE` file for details.

---

## 📞 Support

- **Email:** onetechly@gmail.com
- **Website:** [https://onetechly.com](https://onetechly.com)
- **Issues:** [GitHub Issues](https://github.com/Ambro19/onetechly-frontend/issues)

---

## 🙏 Acknowledgments

- **FastAPI** for the incredible Python web framework
- **Render** for seamless cloud deployment
- **Stripe** for robust payment infrastructure
- **yt-dlp** for reliable YouTube content extraction

---

**Built with ❤️ by OneTechly**