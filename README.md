# M.S. Store — Production Ready MERN Store

A complete production-ready store website for a local physical store in Jaranwala, Faisalabad.

## Project Structure

```
ms-store/
├── frontend/          ← React + Vite (JavaScript)
└── backend/           ← Node.js + Express + MongoDB
```

---

## Frontend Setup

```bash
cd frontend
cp .env.example .env      # set VITE_API_URL
npm install
npm run dev
```

**Environment variables (`frontend/.env`):**

```
VITE_API_URL=http://localhost:5000
```

---

## Backend Setup

```bash
cd backend
cp .env.example .env      # fill in all values
npm install
npm run dev
```

**Environment variables (`backend/.env`):**

```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/msstore
JWT_SECRET=<your_secret_key>
CLOUDINARY_CLOUD_NAME=lfsgqxax
CLOUDINARY_API_KEY=294297756273469
CLOUDINARY_API_SECRET=qDL7AJL5dwdfyF0U3IieEZtcypI
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_gmail_app_password
CONTACT_EMAIL=msohaib.ai.dev@gmail.com
CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

**Gmail SMTP setup:** Enable 2FA on Gmail → Generate an App Password → use it as `SMTP_PASS`.

---

## Admin Account

The admin account is auto-created on first startup:

- **Email:** msohaib.ai.dev@gmail.com
- **Password:** 12345678

Visit `/admin/login` to access the dashboard.

---

## Deployment

### Frontend → Vercel

1. Connect `frontend/` folder to Vercel
2. Set `VITE_API_URL` to your backend URL
3. The `frontend/vercel.json` handles SPA routing

### Backend → Vercel

1. Connect `backend/` folder to Vercel
2. Add all environment variables in Vercel dashboard
3. The `backend/vercel.json` routes all requests to `api/index.js`

---

## Features

- Beautiful production-ready store UI
- WhatsApp ordering on every product
- Products with categories, filters, search, pagination
- Contact form that sends real emails via Nodemailer
- Full admin dashboard: Products, Categories, Reviews, Messages, Settings
- JWT authentication with httpOnly cookies
- Image upload via Cloudinary
- MongoDB with Mongoose
- No delivery/shipping references (local physical store)
