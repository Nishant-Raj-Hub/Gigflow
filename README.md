#  GigFlow

**A modern freelance marketplace connecting clients with talented freelancers.**

Connect. Bid. Hire. Get work done. Simple as that.

---


## ⚡ Features

✅ **User Authentication** - Secure JWT-based auth with HttpOnly cookies  
✅ **Dual Roles** - Be a client or freelancer (or both!)  
✅ **Gig Management** - Post, browse, and search gigs  
✅ **Instant Hiring** - Hire freelancers with one click   
✅ **Responsive Design** - Beautiful UI on all devices  
✅ **Form Validation** - Zod validation on frontend

---

## 🛠️ Tech Stack

### Frontend

- **TypeScript** - Type-safe code
- **Redux Toolkit** - State management
- **React Query** - Data fetching & caching
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Accessible component library
- **Formik + Yup** - Form handling & validation
- **Wouter** - Client-side routing

### Backend

- **Node.js + Express** - Server runtime & framework
- **MongoDB + Mongoose** - NoSQL database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

---

## 🚦 Quick Start

### Setup

#### 1. Install Dependencies

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

#### 2. Configure Environment Variables

**Frontend** (`client/.env`)

```
VITE_API_BASE_URL=http://localhost:5000 or Deployed backend base URL 
```

**Backend** (`server/.env`)

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

#### 3. Start the Application

```bash
# Terminal 1 - Backend (from server folder)
npm run dev

# Terminal 2 - Frontend (from client folder)
npm run dev
```

**Frontend**: http://localhost:5173  
**Backend**: http://localhost:5000

---




## 📚 API Endpoints

### Auth

- `POST /auth/register` - Create account
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

### Gigs

- `GET /gigs` - List all gigs
- `GET /gigs/:id` - Get gig details
- `POST /gigs` - Create new gig

### Bids

- `GET /gigs/:id/bids` - Get gig bids
- `POST /bids` - Submit/create bid
- `POST /bids/:id/hire` - Hire freelancer

---

