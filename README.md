# Swoosh - professional URL Shortener

A high-performance, scalable URL shortener with a modern, professional UI, built with Node.js, TypeScript, PostgreSQL, and Redis.

## Features

-   **URL Shortening**: Generate concise, sharable short links.
-   **Custom Aliases**: (Future implementation) Support for custom back-halves.
-   **Click Analytics**: Track detailed analytics including unique clicks, timestamps, and user metadata.
-   **Authentication**: Secure user sign-up and login using JWT and HTTP-only cookies.
-   **High Performance**:
    -   **Redis Caching**: Fast URL redirection.
    -   **Background Workers**: Asynchronous processing for analytics to ensure low latency.
    -   **Nginx Load Balancing**: Ready for horizontal scaling using Docker Compose.
-   **Rate Limiting**: Protects APIs from abuse.
-   **Professional UI**: A polished, responsive web interface for managing links.

## Tech Stack

-   **Backend**: Node.js, Express, TypeScript
-   **Database**: PostgreSQL (Persistent storage)
-   **Caching/Queue**: Redis
-   **Frontend**: Vanilla HTML/CSS/JS (Lightweight and fast)
-   **DevOps**: Docker, Docker Compose, Nginx

## Prerequisites

-   **Node.js** (v18+)
-   **npm** or **yarn**
-   **PostgreSQL** (Local or Remote)
-   **Redis** (Local or Remote)
-   **Docker** (Optional, for containerized run)

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/urlshortener
REDIS_URL=redis://localhost:6379
BASE_URL=http://localhost:3000
NODE_ENV=development
```

## Installation & Running Locally

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd url-shortener
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Database**
    -   Ensure PostgreSQL and Redis are running.
    -   The application will automatically initialize tables on start (or import `src/db/schema.sql`).

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    -   **Worker**: To run the background worker for analytics:
        ```bash
        npm run dev:worker
        ```

5.  **Build and Start (Production)**
    ```bash
    npm run build
    npm start
    ```

## Running with Docker

The easiest way to run the full stack (App, Worker, Postgres, Redis, Nginx):

```bash
docker-compose up --build
```
Access the application at `http://localhost`.

## API Endpoints

### Authentication
-   `POST /api/auth/register` - Create a new account.
-   `POST /api/auth/login` - Log in.
-   `POST /api/auth/logout` - Log out.
-   `GET /api/auth/me` - Get current user info.

### URLs
-   `POST /api/shorten` - Shorten a new URL (Requires Auth).
-   `GET /:code` - Redirect to original URL.
-   `GET /api/analytics/:code` - Get click stats for a URL.

## License

ISC
