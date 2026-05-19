# Installation & Setup Guide

Complete step-by-step installation guide for the Smart Student Task Management System.

## 📋 Prerequisites

Before installation, ensure you have:

### Required Software
- **Node.js** >= 16.x ([Download](https://nodejs.org/))
- **npm** >= 8.x (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Code Editor** (VS Code recommended)

### Accounts (Optional)
- MongoDB Atlas account for cloud database
- Google OAuth for social login
- Weather API key for external integrations

## ✅ System Check

Verify installation:

```bash
# Check Node.js version
node --version
# Expected: v16.x or higher

# Check npm version
npm --version
# Expected: 8.x or higher

# Check Git version
git --version
```

## 📥 Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/smart-task-management.git

# Navigate to project
cd smart-task-management

# Verify structure
ls -la
# You should see: backend/ frontend/ README.md
```

## 🔧 Step 2: Backend Setup

### 2.1 Navigate to Backend

```bash
cd backend
```

### 2.2 Install Dependencies

```bash
# Install all npm packages
npm install

# This will install:
# - express (web framework)
# - mongoose (database ODM)
# - jsonwebtoken (authentication)
# - bcryptjs (password hashing)
# - cors (cross-origin)
# - dotenv (environment variables)
# - and other dependencies
```

**Troubleshooting Installation Issues:**

```bash
# Clear npm cache if installation fails
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### 2.3 MongoDB Setup

#### Option A: Local MongoDB

```bash
# Windows
# Download from: https://www.mongodb.com/try/download/community
# Run installer and follow prompts
# MongoDB runs on: mongodb://localhost:27017

# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu/Debian)
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

#### Option B: MongoDB Atlas (Recommended for Production)

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a cluster
4. Create database user
5. Whitelist your IP
6. Get connection string
7. Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

### 2.4 Environment Configuration

```bash
# Copy example file
cp .env.example .env

# Edit .env file with your settings
```

**Linux/Mac:**
```bash
nano .env
# or
vim .env
```

**Windows (PowerShell):**
```powershell
notepad .env
```

**Complete .env File:**

```env
# === DATABASE ===
MONGODB_URI=mongodb://localhost:27017/smart-task-management
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-task-management

# === SERVER ===
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# === JWT AUTHENTICATION ===
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024_update
JWT_EXPIRE=7d

# === EXTERNAL APIs ===
WEATHER_API_KEY=get_from_openweathermap.org
QUOTE_API_KEY=get_from_quotable.io

# === REDIS (Optional - only if using caching) ===
REDIS_ENABLED=false
REDIS_URL=redis://localhost:6379

# === RATE LIMITING ===
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# === CORS ===
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# === LOGGING ===
LOG_LEVEL=debug
```

### 2.5 Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

**Expected Output:**
```
✅ MongoDB Connected: localhost
Server running on port 5000
```

**Keep this terminal running** for the next steps.

## 💻 Step 3: Frontend Setup

### 3.1 Open New Terminal and Navigate to Frontend

```bash
# Open new terminal window/tab
cd smart-task-management/frontend
```

### 3.2 Install Dependencies

```bash
npm install

# This will install:
# - react and react-dom
# - vite (build tool)
# - react-router-dom (routing)
# - axios (HTTP client)
# - tailwindcss (styling)
# - socket.io-client (real-time)
# - other utilities
```

### 3.3 Environment Configuration

```bash
# Copy example file
cp .env.example .env

# Edit .env file
```

**Complete .env File:**

```env
# === BACKEND API ===
VITE_API_BASE_URL=http://localhost:5000

# === GOOGLE OAUTH (Optional) ===
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# === FEATURES ===
VITE_ENABLE_SOCKET=true
VITE_ENABLE_ANALYTICS=true
```

### 3.4 Start Frontend Server

```bash
npm run dev

# Expected output:
# Local:        http://localhost:5173/
# press q to quit
```

## 🌐 Access the Application

Open your browser and visit:

```
http://localhost:5173
```

You should see the login page.

## ✨ Verification Checklist

- [ ] Backend running on `http://localhost:5000`
- [ ] Frontend running on `http://localhost:5173`
- [ ] MongoDB connected
- [ ] Can load login page
- [ ] No console errors

## 📝 First Steps

### 1. Test Backend API

```bash
# In a new terminal, test the health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {"success":true,"message":"Smart Student Task API is healthy"}
```

### 2. Register a New Account

1. Go to `http://localhost:5173`
2. Click "Register"
3. Fill in:
   - Name: John Doe
   - Email: john@example.com
   - Password: SecurePass123!
4. Click "Register"
5. You'll be redirected to dashboard

### 3. Create a Task

1. Click "New Task"
2. Fill in:
   - Title: "Complete React Project"
   - Description: "Build the task management system"
   - Due Date: (future date)
   - Priority: High
3. Click "Create"

### 4. Test Dark Mode

1. Click theme toggle button (top-right)
2. Interface should switch between light (default) and dark modes

## 🚀 Additional Setup

### Optional: Redis Setup (for caching)

```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis-server

# Windows
# Download from: https://github.com/microsoftarchive/redis/releases
# Or use Docker: docker run -p 6379:6379 redis

# Then in .env, set:
REDIS_ENABLED=true
```

### Optional: External APIs

#### OpenWeather API (for weather feature)
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for free account
3. Get API key from dashboard
4. Add to `.env`:
   ```env
   WEATHER_API_KEY=your_api_key_here
   ```

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5173`
   - `http://localhost:3000`
6. Copy Client ID
7. Add to frontend `.env`:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   ```

## 📚 Project Structure After Setup

```
smart-task-management/
├── backend/
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── node_modules/
│
├── frontend/
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── node_modules/
│
└── README.md
```

## 🐛 Troubleshooting

### Backend Won't Start

**Error: Port 5000 already in use**
```bash
# Find process using port 5000
# Windows
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F

# Or change PORT in .env
PORT=5001
```

**Error: MongoDB connection refused**
```bash
# Ensure MongoDB is running
# Check connection string in .env
# For local: mongodb://localhost:27017/smart-task-management
# For Atlas: mongodb+srv://username:password@cluster.mongodb.net/dbname
```

### Frontend Won't Start

**Error: Port 5173 already in use**
```bash
# Kill process using port
# Or change port in vite.config.js
# Or run on different port:
npm run dev -- --port 5174
```

**Error: API connection failed**
```bash
# Ensure backend is running on port 5000
# Check VITE_API_BASE_URL in frontend .env
# Should be: http://localhost:5000
```

### Cannot Login/Register

**Error: "Invalid credentials"**
- Ensure backend is running
- Check MongoDB connection
- Check browser console for errors (F12)

**Error: "CORS error"**
- Backend not allowing frontend URL
- Add to backend .env:
  ```env
  CORS_ORIGIN=http://localhost:5173
  ```

## 📖 Next Steps

1. **Explore Features**
   - Create, edit, delete tasks
   - Test filtering and search
   - Try dark mode
   - View statistics

2. **Customize**
   - Modify colors in tailwind.config.js
   - Add more features
   - Integrate more APIs

3. **Deploy**
   - Follow deployment guides in README.md
   - Deploy backend to Render or Railway
   - Deploy frontend to Vercel or Netlify

## 💡 Tips

- Keep both terminals running during development
- Use browser DevTools (F12) to debug
- Check console for errors
- Use network tab to inspect API calls
- Use Redux DevTools if state management is needed

## 📞 Getting Help

If you encounter issues:

1. Check error messages in console
2. Review the troubleshooting section
3. Check GitHub issues
4. Search Stack Overflow
5. Ask in community forums

## ✅ Installation Complete!

You now have a fully functional full-stack application ready for development.

**Happy Coding! 🎉**

---

For more information:
- See [README.md](../README.md) for project overview
- See [backend/README.md](../backend/README.md) for backend details
- See [frontend/README.md](../frontend/README.md) for frontend details
