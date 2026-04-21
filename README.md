# Notes App

A simple notes application with authentication and role-based access.

## Features

- User login and auto register
- User dashboard for notes
- Note create, update, delete, view
- Admin dashboard
- Admin can view all users
- Admin can view user notes
- Admin can change user role
- Simple UI with React, Vite, Tailwind

## Tech Stack

Frontend:
- React
- Vite
- Tailwind CSS
- Axios
- React Router

Backend:
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Cookie based auth

## Folder Structure

```bash
frontend/
backend/
```

## Backend Setup

### Install dependencies
```bash
cd backend
npm install
```

### Create `.env`
```env
NODE_ENV=development
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

### Run backend locally
```bash
npm run dev
```

Backend will run on:
```bash
http://localhost:3000
```

## Frontend Setup

### Install dependencies
```bash
cd frontend
npm install
```


### Run frontend locally
```bash
npm run dev
```

Frontend will run on:
```bash
http://localhost:5173
```

## Default Admin Login:
- email: admin@gmail.com
- password: admin@123

## Important Backend Endpoints

### Auth
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Notes
- `GET /api/notes`
- `POST /api/notes`
- `GET /api/notes/:id`
- `PUT /api/notes/update/:id`
- `DELETE /api/notes/delete/:id`

### Admin
- `GET /api/admin/users`
- `GET /api/admin/all-notes`
- `GET /api/admin/user/:userId`
- `PUT /api/admin/set-role/:userId`

## Local Cookie Fix

For local development, the JWT cookie must use:
- `sameSite: "lax"`
- `secure: false`

For production, it should use:
- `sameSite: "none"`
- `secure: true`

This is handled by `NODE_ENV`.

## Role Based Access

- Normal users can access only their own dashboard and notes
- Admin users can access the admin dashboard
- Admin dashboard button should show for everyone, but only admins can open it
- Non-admin users should see an access denied message

## Frontend Behavior

### User dashboard
- Show notes in grid cards
- Each card shows:
  - title
  - short description up to 2 lines
  - created date
- If no notes exist, show a message
- Clicking a note opens a detail page
- From detail page, user can update or delete note
- After update or delete, go back to dashboard

### Admin dashboard
- Show all users in cards
- Each user card shows:
  - email
  - role
  - note count
- Admin can open a user card
- Admin can update that user’s notes
- Admin can change role between `user` and `admin`

## Render Deployment for Backend

### Build Command
```bash
npm install
```

### Start Command
```bash
npm start
```

### Root Directory
Leave empty if `package.json` is in the repository root.

If backend is inside a folder:
```bash
backend
```

### Render Environment Variables
```env
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

## Vercel Deployment for Frontend

### Build Command
```bash
npm run build
```

### Output Directory
```bash
dist
```

### Environment Variables
```env
VITE_API_URL=https://your-backend-domain.onrender.com/api
```

## Before Deploying

Make sure these are correct:

- backend CORS allows your frontend URL
- frontend uses `withCredentials: true` in axios
- backend cookie settings switch by environment
- MongoDB connection string is valid
- JWT secret is set
- frontend API base URL is pointing to deployed backend

## Run Summary

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Notes

This project is intentionally kept simple with a clean and human-looking UI.
