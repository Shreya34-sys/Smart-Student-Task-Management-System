# Backend - Smart Student Task Management System

Production-ready Node.js Express backend with MongoDB, JWT authentication, and real-time features.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Edit .env with your configuration

# Run development server
npm run dev

# Run production server
npm start
```

## 📦 Installation Commands

### Install Node.js Dependencies
```bash
npm install
```

### Install Specific Packages
```bash
# Authentication
npm install jsonwebtoken bcryptjs

# Database
npm install mongoose

# Server
npm install express cors helmet

# Utilities
npm install dotenv axios morgan

# Rate Limiting
npm install express-rate-limit

# Caching
npm install redis

# Real-time
npm install socket.io

# Development
npm install --save-dev nodemon
```

## ⚙️ Environment Setup

Create `.env` file in backend directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/smart-task-management
# MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/dbname

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
JWT_EXPIRE=7d

# External APIs
WEATHER_API_KEY=get_from_openweathermap.org
QUOTE_API_KEY=get_from_api_provider

# Redis (Optional - for caching)
REDIS_ENABLED=false
REDIS_URL=redis://localhost:6379

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Logging
LOG_LEVEL=debug
```

## 📂 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   ├── env.js             # Environment variables
│   │   └── jwt.js             # JWT configuration
│   │
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── taskController.js  # Task operations
│   │   ├── userController.js  # User profile
│   │   └── ...
│   │
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── taskRoutes.js      # Task endpoints
│   │   └── ...
│   │
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   ├── errorHandler.js    # Error handling
│   │   ├── rateLimiter.js     # Rate limiting
│   │   ├── logger.js          # Logging
│   │   └── validate.js        # Input validation
│   │
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Task.js            # Task schema
│   │   └── ...
│   │
│   ├── services/
│   │   ├── authService.js     # Auth business logic
│   │   ├── taskService.js     # Task business logic
│   │   └── socketService.js   # Socket.io setup
│   │
│   ├── utils/
│   │   ├── validators.js      # Validation functions
│   │   ├── errorHandler.js    # Error utilities
│   │   └── helpers.js
│   │
│   ├── app.js                 # Express setup
│   └── server.js              # Entry point
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🔐 Authentication Flow

1. **Register**
   - User provides: name, email, password
   - Password is hashed with bcryptjs
   - User created in MongoDB
   - Response: JWT token + user data

2. **Login**
   - User provides: email, password
   - Password compared with hash
   - JWT token generated
   - Response: JWT token + user data

3. **Protected Routes**
   - Client sends: Authorization header with token
   - Middleware verifies token
   - If valid: attach user data to request
   - If invalid: return 401 error

## 📝 API Endpoints

### Authentication (`/api/auth`)
```
POST   /auth/register       # Register new user
POST   /auth/login          # Login user
POST   /auth/logout         # Logout user
GET    /auth/profile        # Get current user profile
PUT    /auth/profile        # Update profile
POST   /auth/refresh-token  # Refresh JWT token
```

### Tasks (`/api/tasks`)
```
GET    /tasks               # Get all tasks (with filters)
POST   /tasks               # Create new task
GET    /tasks/:id           # Get single task
PUT    /tasks/:id           # Update task
DELETE /tasks/:id           # Delete task
PUT    /tasks/:id/status    # Update task status
GET    /tasks/stats/summary # Get task statistics
```

### External APIs (`/api/external`)
```
GET    /external/weather    # Get weather data
GET    /external/quotes     # Get random quote
GET    /external/productivity # Get productivity tip
```

### Teams (`/api/teams`)
```
GET    /teams               # Get all teams
POST   /teams               # Create team
PUT    /teams/:id           # Update team
DELETE /teams/:id           # Delete team
POST   /teams/:id/members   # Add member
DELETE /teams/:id/members/:userId # Remove member
```

### Admin (`/api/admin`)
```
GET    /admin/users         # Get all users (admin only)
GET    /admin/stats         # Get platform statistics
DELETE /admin/users/:id     # Delete user (admin only)
```

## 🔒 Middleware

### Authentication Middleware
```javascript
import { verifyToken } from './middleware/auth.js';

// Usage
app.get('/api/protected', verifyToken, controller);
```

### Rate Limiter Middleware
```javascript
import { apiLimiter } from './middleware/rateLimiter.js';

// Usage
app.use('/api/', apiLimiter);
```

### Error Handler Middleware
```javascript
import { errorHandler } from './middleware/errorHandler.js';

// Usage - must be last middleware
app.use(errorHandler);
```

## 💾 MongoDB Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ('user' | 'admin'),
  profileImage: String,
  theme: String ('light' | 'dark'),
  tasksCreated: Number,
  tasksCompleted: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  userId: ObjectId (ref: User),
  title: String,
  description: String,
  priority: String ('low' | 'medium' | 'high'),
  status: String ('pending' | 'in-progress' | 'completed' | 'archived'),
  dueDate: Date,
  category: String,
  tags: [String],
  completedAt: Date,
  isOverdue: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- taskController.test.js
```

## 📊 Logging

All API requests are logged using Morgan:
```
GET /api/tasks - 200 - 45ms
POST /api/tasks - 201 - 120ms
PUT /api/tasks/123 - 200 - 80ms
```

## 🚀 Deployment

### Deploy to Render

1. Connect GitHub repository
2. Create Web Service
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy

### Deploy to Railway

1. Create new project
2. Connect GitHub
3. Add environment variables
4. Deploy

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

## 🔧 Troubleshooting

### MongoDB Connection Fails
```bash
# Check MONGODB_URI in .env
# Ensure MongoDB is running locally or Atlas is accessible
# Check IP whitelist for MongoDB Atlas
```

### JWT Token Issues
```bash
# Ensure JWT_SECRET is set correctly
# Check token expiration: JWT_EXPIRE
# Clear browser localStorage and re-login
```

### Port Already in Use
```bash
# Linux/Mac
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

## 📚 Additional Resources

- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Guide](https://jwt.io/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 📝 Code Examples

### Create a Protected Route

```javascript
import { verifyToken } from './middleware/auth.js';
import { getTasks } from './controllers/taskController.js';

router.get('/tasks', verifyToken, getTasks);
```

### Handle Errors

```javascript
import { AppError, asyncHandler } from './middleware/errorHandler.js';

export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  res.json({ success: true, data: task });
});
```

### Use Redis Caching

```javascript
import { cacheOps } from './config/redis.js';

// Set cache
await cacheOps.set(`tasks:${userId}`, tasks, 3600);

// Get cache
const cachedTasks = await cacheOps.get(`tasks:${userId}`);
```

---

**Backend Setup Complete! 🎉**

For frontend setup, navigate to the `frontend/` directory and follow the instructions in `frontend/README.md`.
