# 🎬 YouTube Content Downloader (YCD) — by OneTechly

**OneTechly** builds cloud-native SaaS solutions that simplify how creators, developers, and businesses manage content.  
**YouTube Content Downloader (YCD)** is a sleek, mobile-ready application that lets users extract clean YouTube transcripts, MP3 audio, or full video downloads — all within a secure, scalable, and subscription-enabled platform.

🌐 **Live App:** [https://onetechly.com/ycd](https://onetechly.com/ycd)  
🏢 **Company:** [https://onetechly.com](https://onetechly.com)

---

## 🚀 Overview

YCD provides a full-stack SaaS experience:

- **Frontend:** React + Tailwind (modern, responsive UI)
- **Backend:** FastAPI (Python) with SQLAlchemy ORM
- **Database:** SQLite (local) / PostgreSQL (production-ready)
- **Payments:** Stripe integration with webhooks
- **Email:** SendGrid integration for password resets
- **Deployment:** Render Cloud with SPA-friendly rewrite rules
- **Security:** JWT authentication, HTTPS, and rate-limit guardrails

Designed for simplicity, reliability, and a polished user experience — ready for production.

---

## ✨ Features

| Category | Description |
|-----------|-------------|
| 🧠 **Transcripts** | Extract clean and timestamped YouTube transcripts |
| 🎧 **Audio** | Convert videos to MP3 audio |
| 🎥 **Video** | Download full YouTube videos |
| 💳 **Subscriptions** | Stripe-powered Pro & Premium plans |
| 🔒 **Authentication** | Secure JWT-based login system |
| 📬 **Password Reset** | SendGrid-powered secure token flow |
| 📱 **Mobile-Ready** | Optimized UI for all screen sizes |
| 📊 **Dashboard** | Usage tracking, batch jobs, and history logs |
| ☁️ **Scalable** | Cloud-native and monitored on Render |

---

## ⚙️ Deployment Architecture

### 🔹 Frontend (React)
Deployed via **Render Static Site**.  
**Rewrite Rule (SPA Routing):**
