# Smart Student Task Management System

Production-ready MERN internship project with React, Vite, Tailwind, Framer Motion, Express, MongoDB, JWT auth, Google OAuth support, role-based access, Socket.io notifications, charts, Kanban drag-and-drop, file uploads, Redis-ready caching, activity logs, email notifications, PDF export, AI productivity assistance, profile management, and team collaboration.

## Installation

```powershell
cd "C:\Cognify Internship\task 6"
npm run install:all
```

Run the API and UI in separate terminals:

```powershell
npm run dev:backend
```

```powershell
npm run dev:frontend
```

Frontend: `http://localhost:5173` or Vite's next available port.

Backend: `http://localhost:5000/api`

## Folder Structure

```text
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
frontend/
  src/
    api/
    components/
    context/
    pages/
    utils/
```

## API Routes

Auth:

```text
POST   /api/auth/register   { name, email, password, confirmPassword, course? }
POST   /api/auth/login      { email, password }
POST   /api/auth/google
GET    /api/auth/me         Authorization: Bearer <token>
PATCH  /api/auth/profile    Authorization: Bearer <token>
```

Successful registration and login responses include:

```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "id": "mongo-id",
    "name": "Student Name",
    "email": "student@example.com",
    "role": "student"
  }
}
```

Tasks:

```text
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/analytics
GET    /api/tasks/export/pdf
POST   /api/tasks/email-summary
GET    /api/tasks/:id
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
POST   /api/tasks/:id/attachments
POST   /api/tasks/:id/assign
```

All task routes are protected with JWT middleware. Send the token as:

```text
Authorization: Bearer <token>
```

Teams and collaboration:

```text
GET    /api/teams
POST   /api/teams
POST   /api/teams/:id/invite
GET    /api/activity
POST   /api/assistant/ask
```

Admin role-only:

```text
GET    /api/admin/users
PATCH  /api/admin/users/:id/role
```

External:

```text
GET    /api/external/quote
```

## Feature Checklist

- JWT authentication with bcrypt hashing
- Login, registration, logout, and profile session verification
- Protected React routes with automatic redirect
- Google OAuth login endpoint and frontend button
- Role-based access with admin-only APIs and admin UI
- Dashboard analytics with Recharts status and priority charts
- Real-time Socket.io notifications
- Dark/light mode
- Search, sorting, filtering
- Multer file upload for task attachments
- AI productivity assistant
- External quote API
- Redis caching with in-memory fallback
- Activity logging
- Responsive mobile-first Tailwind UI
- Framer Motion page animation
- Kanban drag-and-drop board
- Email task summaries
- PDF task export
- Loading skeletons
- Toast notifications
- Profile management
- Team collaboration system with team-scoped tasks

## Deployment

Render backend:

1. Root directory: `backend`
2. Build command: `npm install`
3. Start command: `npm start`
4. Add all backend environment variables.
5. Set `CLIENT_URL` to the deployed Vercel URL.

Vercel frontend:

1. Root directory: `frontend`
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add `VITE_API_URL`, `VITE_SOCKET_URL`, and optional `VITE_GOOGLE_CLIENT_ID`.

## Security Notes

- Rotate any database password shared in chat or screenshots.
- Use a long random `JWT_SECRET` in production.
- Restrict MongoDB Atlas network access for deployment.
- Configure real SMTP credentials only in environment variables.
