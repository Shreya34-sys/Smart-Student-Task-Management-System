# Deployment Guide

Complete guide for deploying the Smart Student Task Management System to production.

## 🚀 Deployment Overview

### Architecture
```
Frontend (Vercel/Netlify)
         ↓
         ↓ HTTPS
         ↓
Backend API (Render/Railway)
         ↓
         ↓
MongoDB Atlas (Database)
```

## 📦 Backend Deployment

### Option 1: Deploy to Render (Recommended)

#### 1.1 Prepare Backend

```bash
cd backend

# Ensure all dependencies are in package.json
npm list

# Test build
npm run build

# Add start script to package.json (if not present)
"start": "node src/server.js"
```

#### 1.2 Setup Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Create new Web Service
4. Connect GitHub repository

#### 1.3 Configure Render Service

1. **Settings:**
   - Name: `smart-task-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Region: `Oregon (default)` or closest to you

2. **Environment Variables:**
   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-task-management
   JWT_SECRET=your_super_secret_key_change_this_unique_value_2024
   JWT_EXPIRE=7d
   PORT=10000
   CLIENT_URL=https://your-frontend-domain.com
   CORS_ORIGIN=https://your-frontend-domain.com
   WEATHER_API_KEY=your_api_key
   REDIS_ENABLED=false
   LOG_LEVEL=info
   ```

3. **Click Deploy**

#### 1.4 Update MongoDB Atlas

If using MongoDB Atlas:

1. Go to MongoDB Atlas
2. Network Access → Add IP Address
3. Add Render IP or allow all (0.0.0.0/0) for development
4. Copy connection string
5. Add to Render environment variables

**Backend URL:** `https://your-app.onrender.com`

### Option 2: Deploy to Railway

#### 2.1 Install Railway CLI

```bash
npm i -g @railway/cli
```

#### 2.2 Deploy

```bash
cd backend
railway login
railway init
railway up
```

#### 2.3 Add Environment Variables

```bash
railway env
# Add all environment variables
```

**Backend URL:** `https://your-project.up.railway.app`

### Option 3: Deploy to Heroku

#### 3.1 Install Heroku CLI

```bash
npm install -g heroku
heroku login
```

#### 3.2 Deploy

```bash
cd backend

# Create app
heroku create your-app-name

# Add environment variables
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

**Backend URL:** `https://your-app-name.herokuapp.com`

## 🌐 Frontend Deployment

### Option 1: Deploy to Vercel (Recommended for React/Vite)

#### 1.1 Prepare Frontend

```bash
cd frontend

# Test build
npm run build

# Verify dist folder created
ls dist/
```

#### 1.2 Deploy to Vercel

**Method A: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
# Follow prompts to connect GitHub
```

**Method B: GitHub Integration**

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import GitHub repository
5. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

#### 1.3 Add Environment Variables

1. In Vercel Dashboard → Settings → Environment Variables
2. Add:
   ```env
   VITE_API_BASE_URL=https://your-backend-api.com
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

3. Redeploy

**Frontend URL:** `https://your-project.vercel.app`

### Option 2: Deploy to Netlify

#### 2.1 Deploy

**Method A: Git Integration**

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select GitHub repository
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Install command: `npm install`

**Method B: Drag & Drop**

```bash
# Build
npm run build

# Drag 'dist' folder to netlify.com
```

#### 2.2 Add Environment Variables

1. Site Settings → Build & Deploy → Environment
2. Add:
   ```env
   VITE_API_BASE_URL=https://your-backend-api.com
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

3. Trigger redeploy

**Frontend URL:** `https://your-site.netlify.app`

### Option 3: Deploy to GitHub Pages

```bash
# Update package.json
{
  "homepage": "https://yourusername.github.io/smart-task-management",
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}

# Install gh-pages
npm install --save-dev gh-pages

# Deploy
npm run deploy
```

## 🗄️ Database Setup

### MongoDB Atlas (Cloud - Recommended)

1. **Create Account**
   - Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier

2. **Create Cluster**
   - Click "Create Cluster"
   - Choose AWS, region, M0 (free)
   - Click "Create"

3. **Create User**
   - Go to Database Access
   - Click "Add Database User"
   - Username: `taskuser`
   - Password: Generate secure password
   - Click "Add User"

4. **Whitelist IPs**
   - Go to Network Access
   - Click "Add IP Address"
   - Either:
     - Add specific IPs (Render, Railway, etc.)
     - Or allow all: `0.0.0.0/0`

5. **Get Connection String**
   - Go to Databases
   - Click "Connect" on cluster
   - Choose "Drivers"
   - Copy connection string
   - Replace `<password>` with your password

6. **Connection String Format**
   ```
   mongodb+srv://taskuser:password@cluster.mongodb.net/smart-task-management
   ```

### Local MongoDB (Development Only)

```bash
# Windows
# Download: https://www.mongodb.com/try/download/community
# Run installer

# macOS
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo apt-get install mongodb
sudo systemctl start mongodb

# Connection String
MONGODB_URI=mongodb://localhost:27017/smart-task-management
```

## 🔐 Security Checklist

### Environment Variables
- [ ] Change `JWT_SECRET` to strong random string
- [ ] Use production database credentials
- [ ] Set `NODE_ENV=production`
- [ ] Add API keys for external services
- [ ] Never commit `.env` file

### Database
- [ ] Enable authentication
- [ ] Whitelist specific IPs only (if possible)
- [ ] Use strong passwords
- [ ] Enable encryption at rest
- [ ] Regular backups

### API
- [ ] Enable CORS properly (not `*`)
- [ ] Use HTTPS only
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Log security events

### Frontend
- [ ] No sensitive data in code
- [ ] Sanitize user inputs
- [ ] Secure token storage
- [ ] HTTPS only
- [ ] Regular dependency updates

## 📊 Monitoring

### Backend Monitoring

```bash
# Add logging to track errors
# Monitor CPU, memory, disk usage
# Setup alerts for downtime

# Use services like:
# - Sentry (error tracking)
# - DataDog (monitoring)
# - New Relic (APM)
```

### Frontend Monitoring

```bash
# Monitor:
# - Page load times
# - Error rates
# - User sessions

# Use services like:
# - Vercel Analytics
# - Google Analytics
# - Sentry
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci --prefix backend
      - run: npm test --prefix backend

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Backend
        run: |
          # Deploy script
      - name: Deploy Frontend
        run: |
          # Deploy script
```

## 📈 Performance Optimization

### Backend
- Enable caching (Redis)
- Optimize MongoDB queries
- Use compression middleware
- Implement CDN for static assets
- Database indexing

### Frontend
- Code splitting with React.lazy
- Image optimization
- Minify CSS/JS
- Use CDN for assets
- Lazy load components

## 🚀 Post-Deployment

### Testing
```bash
# Test API endpoints
curl https://your-backend-api.com/api/health

# Test frontend
# Visit https://your-frontend-url.com
# Test all features
```

### Documentation
- [ ] Update README with deployment URLs
- [ ] Document environment setup
- [ ] Add deployment procedures
- [ ] Create runbook for issues

### Monitoring Setup
- [ ] Setup error tracking
- [ ] Setup performance monitoring
- [ ] Setup uptime monitoring
- [ ] Setup alerts

## 📝 Deployment Checklist

### Before Deployment
- [ ] All tests pass
- [ ] Code reviewed
- [ ] Dependencies updated
- [ ] Security scan complete
- [ ] Environment variables set
- [ ] Database backups ready

### Deployment Day
- [ ] Deploy backend
- [ ] Verify backend working
- [ ] Update frontend API URL
- [ ] Deploy frontend
- [ ] Smoke test all features
- [ ] Monitor logs

### Post-Deployment
- [ ] Check error logs
- [ ] Monitor performance
- [ ] Collect user feedback
- [ ] Plan rollback if needed
- [ ] Document issues

## 🆘 Troubleshooting

### Backend Won't Start
```bash
# Check logs
# Verify environment variables
# Check MongoDB connection
# Test locally first
```

### Frontend Can't Connect to API
```bash
# Check VITE_API_BASE_URL
# Verify CORS configuration
# Check network requests in DevTools
```

### High Error Rate
```bash
# Review error logs
# Check database performance
# Review recent changes
# Rollback if necessary
```

## 📞 Deployment Support

For issues:
1. Check service status pages
2. Review documentation
3. Check deployment logs
4. Test locally
5. Contact support

---

**Deployment Complete! 🎉**

Your application is now live and ready for users!

Monitor performance and errors regularly for best results.
