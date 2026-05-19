# Frontend - Smart Student Task Management System

Modern React.js frontend with Vite, Tailwind CSS, and real-time updates.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Edit .env with your backend URL

# Run development server
npm run dev

# Build for production
npm run build
```

## 📦 Installation Commands

### Install Node.js Dependencies
```bash
npm install
```

### Install Specific Packages
```bash
# React & Routing
npm install react react-dom react-router-dom

# HTTP Client
npm install axios

# UI Framework
npm install -D tailwindcss postcss autoprefixer

# Real-time
npm install socket.io-client

# Utilities
npm install date-fns clsx zustand

# Google OAuth
npm install @react-oauth/google

# Notifications
npm install react-toastify

# Development
npm install -D vite @vitejs/plugin-react
```

## ⚙️ Environment Setup

Create `.env` file in frontend directory:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:5000

# Google OAuth (Optional)
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Features
VITE_ENABLE_SOCKET=true
VITE_ENABLE_ANALYTICS=true
```

## 📂 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx         # Top navigation
│   │   ├── Sidebar.jsx        # Side navigation
│   │   ├── TaskCard.jsx       # Task display component
│   │   ├── TaskForm.jsx       # Task creation/edit form
│   │   ├── ThemeToggle.jsx    # Dark/Light mode toggle
│   │   └── ...
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx      # Main dashboard
│   │   ├── Tasks.jsx          # Tasks page
│   │   ├── Login.jsx          # Login page
│   │   ├── Register.jsx       # Registration page
│   │   ├── Profile.jsx        # User profile
│   │   └── NotFound.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx    # Authentication state
│   │   ├── ThemeContext.jsx   # Theme state
│   │   ├── SocketContext.jsx  # Socket.io state
│   │   └── ToastContext.jsx   # Toast notifications
│   │
│   ├── services/
│   │   ├── api.js             # Axios configuration
│   │   ├── authService.js     # Auth API calls
│   │   ├── taskService.js     # Task API calls
│   │   └── externalService.js # External API calls
│   │
│   ├── utils/
│   │   ├── validators.js      # Validation functions
│   │   ├── formatters.js      # String/date formatting
│   │   ├── constants.js       # Constants
│   │   └── helpers.js         # Helper functions
│   │
│   ├── styles/
│   │   ├── index.css          # Global styles
│   │   ├── tailwind.css       # Tailwind imports
│   │   └── animations.css     # Custom animations
│   │
│   ├── App.jsx                # Main App component
│   ├── main.jsx               # Entry point
│   └── index.css              # Root styles
│
├── public/                    # Static assets
├── index.html                 # HTML template
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🎨 Component Structure

### Page Hierarchy
```
App
├── Navbar (global)
├── Sidebar (global)
├── Routes
│   ├── Dashboard/
│   │   ├── TaskOverview
│   │   ├── Statistics
│   │   └── RecentTasks
│   ├── Tasks/
│   │   ├── TaskList
│   │   └── TaskFilters
│   ├── Login
│   ├── Register
│   ├── Profile
│   └── ...
└── ThemeToggle (global)
```

## 🎯 Key Features

### Authentication
- ✅ User registration with validation
- ✅ User login with JWT storage
- ✅ Protected routes
- ✅ Auto-logout on token expiry
- ✅ Google OAuth login (optional)

### Task Management
- ✅ Create, read, update, delete tasks
- ✅ Filter by status, priority, category
- ✅ Search tasks by title/description
- ✅ Sort by date, priority, status
- ✅ Drag and drop task status

### UI/UX
- ✅ Responsive design (mobile-first)
- ✅ Light/Dark mode (light mode default)
- ✅ Smooth animations
- ✅ Loading states
- ✅ Error boundaries
- ✅ Toast notifications

### Real-time Features
- ✅ Live task updates via Socket.io
- ✅ Real-time notifications
- ✅ User activity tracking
- ✅ Presence indicators

## 🌈 Theme Configuration

The application uses Tailwind CSS for styling with a light-first approach:

### Light Mode (Default)
```css
Background: white (#ffffff)
Text: dark gray (#1f2937)
Accent: blue (#3b82f6)
Cards: light gray background
```

### Dark Mode
```css
Background: dark gray (#111827)
Text: light gray (#f3f4f6)
Accent: blue (#60a5fa)
Cards: darker background
```

Toggle between themes in the navbar.

## 🔧 Development

### Running Development Server
```bash
npm run dev
```

Access at `http://localhost:5173`

### Building for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting (if configured)
```bash
npm run lint
```

## 📱 Responsive Breakpoints

Using Tailwind CSS breakpoints:
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

Example:
```jsx
<div className="w-full md:w-1/2 lg:w-1/3">
  Content
</div>
```

## 🔐 Authentication Flow

1. **Register**
   - User fills form with name, email, password
   - Form validates client-side
   - Sends to backend
   - Receives JWT token
   - Stores in localStorage
   - Redirects to dashboard

2. **Login**
   - User enters email and password
   - Form validates
   - Sends to backend
   - Receives JWT token
   - Stores in localStorage
   - Redirects to dashboard

3. **Protected Routes**
   - Check localStorage for token
   - Validate token on app load
   - If invalid, redirect to login
   - If valid, show content

## 📡 API Integration

### Axios Configuration
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Making API Calls
```javascript
// Get tasks
const response = await api.get('/tasks');

// Create task
const response = await api.post('/tasks', taskData);

// Update task
const response = await api.put(`/tasks/${id}`, updatedData);

// Delete task
const response = await api.delete(`/tasks/${id}`);
```

## 🔄 State Management

Using React Context API:

```javascript
// AuthContext
const { user, token, login, logout } = useContext(AuthContext);

// ThemeContext
const { theme, toggleTheme } = useContext(ThemeContext);

// SocketContext
const { socket, isConnected } = useContext(SocketContext);
```

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to vercel.com
3. Import project from GitHub
4. Configure:
   - Framework: Vite
   - Build command: `npm run build`
   - Output: `dist`
5. Add environment variables
6. Deploy

### Deploy to Netlify

1. Push code to GitHub
2. Go to netlify.com
3. Create new site from Git
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables
6. Deploy

### Deploy to GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Update package.json
"homepage": "https://yourusername.github.io/repo-name"

# Add deploy scripts
"deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

## 📝 Best Practices

### Component Organization
```javascript
// Imports at top
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Component definition
export default function MyComponent() {
  // State and hooks
  const [state, setState] = useState();
  const navigate = useNavigate();

  // Effects
  useEffect(() => {
    // setup
    return () => {
      // cleanup
    };
  }, []);

  // Handlers
  const handleClick = () => {
    // logic
  };

  // Render
  return <div>Content</div>;
}
```

### Error Handling
```javascript
try {
  const response = await api.get('/tasks');
  setTasks(response.data);
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized
    logout();
  } else {
    // Show error toast
    showToast(error.message, 'error');
  }
}
```

### Loading States
```javascript
const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // fetch data
    } finally {
      setIsLoading(false);
    }
  };
  fetchData();
}, []);

if (isLoading) return <LoadingSpinner />;
```

## 🐛 Troubleshooting

### CORS Errors
- Check backend CORS_ORIGIN includes your frontend URL
- Ensure credentials: true in Axios config if using cookies

### Token Not Persisting
- Check localStorage in browser DevTools
- Ensure token is saved after login
- Check token expiration

### Page Blank
- Check browser console for errors
- Verify API_BASE_URL in .env
- Check network requests in DevTools

### Styles Not Applying
- Restart dev server
- Clear browser cache
- Check Tailwind config
- Verify class names are correct

## 📚 Useful Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)
- [Socket.io Client](https://socket.io/docs/v4/client-api/)

---

**Frontend Setup Complete! 🎉**

For backend setup, navigate to the `backend/` directory and follow the instructions in `backend/README.md`.
