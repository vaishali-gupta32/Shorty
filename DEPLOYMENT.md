# Deployment Guide

Since this application uses **Node.js**, **PostgreSQL**, and **Redis**, it requires a hosting provider that supports persistent databases and background workers.

We recommend **Railway** or **Render** for the easiest setup.

## Option 1: Railway (Recommended)

Railway is excellent for this stack because it auto-detects the setup and makes provisioning Postgres and Redis incredibly simple.

### Steps:
1.  **Push your code to GitHub** (if you haven't already).
2.  Sign up at [railway.app](https://railway.app/).
3.  Click **"New Project"** -> **"Deploy from GitHub repo"**.
4.  Select this repository.
5.  **Add Database & Redis**:
    -   In the project view, click **"New"** -> **"Database"** -> **"PostgreSQL"**.
    -   Click **"New"** -> **"Database"** -> **"Redis"**.
6.  **Configure Environment Variables**:
    -   Railway often auto-injects `DATABASE_URL` and `REDIS_URL`.
    -   Go to your Node.js service -> **Variables**.
    -   Verify `DATABASE_URL` and `REDIS_URL` are set (or link them from the variable picker).
    -   Add `BASE_URL`: Set this to your Railway public domain (e.g., `https://web-production-xxxx.up.railway.app`).
    -   Add `Start Command`: `npm run start` (Railway usually detects this, but good to be sure).
7.  **Deploy**: Railway will build and deploy.

## Option 2: Render

Render offers a similar experience with a free tier for some services.

### Steps:
1.  Sign up at [render.com](https://render.com/).
2.  **Create a PostgreSQL Database**:
    -   Click "New" -> "PostgreSQL".
    -   Copy the "Internal Connection URL".
3.  **Create a Redis Instance**:
    -   Click "New" -> "Redis".
    -   Copy the "Internal Connection URL".
4.  **Create a Web Service** (for the App):
    -   Connect your GitHub repo.
    -   **Build Command**: `npm install && npm run build`
    -   **Start Command**: `npm start`
    -   **Environment Variables**:
        -   `DATABASE_URL`: Paste the Postgres Internal URL.
        -   `REDIS_URL`: Paste the Redis Internal URL.
        -   `BASE_URL`: Your Render app URL (e.g., `https://swoosh.onrender.com`).
        -   `NODE_ENV`: `production`

### Important Note for Worker
To run the analytics background worker, you need to deploy a **second service** (or "Background Worker" on Render) using the same repo:
-   **Start Command**: `npm run worker`
-   **Env Vars**: Same as the web service.

## Environment Variables Reference

Ensure these are set in your hosting provider's dashboard:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Connection string for Postgres | `postgres://user:pass@host:5432/db` |
| `REDIS_URL` | Connection string for Redis | `redis://host:6379` |
| `BASE_URL` | The public URL of your deployed site | `https://myapp.railway.app` |
| `PORT` | (Optional) Port to listen on | `3000` (Maintained by provider usually) |
