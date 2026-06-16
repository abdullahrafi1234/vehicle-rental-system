# 🚗 Vehicle Rental System

**Live URL:** https://vehicle-rental-system-lac-three.vercel.app

---

## ✨ Features

- User registration and login with JWT authentication
- Role-based access control (Admin & Customer)
- Vehicle inventory management
- Booking system with automatic price calculation
- Auto-return booking via scheduled Cron Job

---

## 🛠️ Technology Stack

- **Node.js** + **TypeScript**
- **Express.js**
- **PostgreSQL** (Neon)
- **bcrypt**
- **jsonwebtoken**
- **node-cron**

---

## ⚙️ Setup & Usage

### 1. Clone the repository

```bash
git clone https://github.com/abdullahrafi1234/vehicle-rental-system.git
cd vehicle-rental-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 4. Run the server

```bash
npm run dev
```
