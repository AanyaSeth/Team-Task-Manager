# Team Task Manager MVP

A full-stack project management application with role-based access control built with the MERN stack.

## Tech Stack
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt
- **Frontend:** React, Vite, React Router, Axios, CSS
- **Authentication:** JWT (JSON Web Tokens)

## Project Structure
- `/backend`: Node.js API with Express.
- `/frontend`: React client initialized with Vite.

## Requirements
- Node.js (v16+)
- MongoDB connection string (Atlas or local)

## Setup & Running Locally

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your MongoDB URI.
   ```bash
   cp .env.example .env
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   (Server will run on `http://localhost:5000`)

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (Optional if using default port 5000):
   Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the Vite dev server:
   ```bash
   npm run dev
   ```

## Default Behavior
- The first user who registers will be an Admin if they select the Admin role during sign up.
- Admins can create projects and assign tasks.
- Members can view tasks assigned to them and update their status.

## Deployment Guide

### 1. Pushing to GitHub
Before deploying, you need to push your code to GitHub. A `.gitignore` file has already been created to exclude sensitive files like `node_modules` and `.env`.

1. Initialize Git and commit your files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Create a new empty repository on GitHub.
3. Link your local repository to GitHub and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

### 2. Deploying the Backend (Railway / Render)
1. Go to [Railway](https://railway.app/) or [Render](https://render.com/).
2. Create a new Web Service from your GitHub repository.
3. **Root Directory:** Set the root directory to `backend`.
4. **Environment Variables:** Add the following environment variables:
   - `MONGO_URI` = your production MongoDB connection string
   - `JWT_SECRET` = your production JWT secret
   - `PORT` = `5000` (or whatever the platform defaults to)
5. **Start Command:** `npm start` (Railway and Render should automatically detect this).
6. Once deployed, copy your backend's public URL (e.g., `https://my-backend.up.railway.app`).

### 3. Deploying the Frontend (Vercel)
1. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Import your GitHub repository.
3. **Framework Preset:** Vercel should automatically detect **Vite**.
4. **Root Directory:** Set this to `frontend`.
5. **Environment Variables:**
   - Add `VITE_API_URL` and set it to your deployed backend URL from step 2 (e.g., `https://my-backend.up.railway.app/api`).
6. Click **Deploy**.

Once finished, Vercel will provide you with a live URL for your application!
