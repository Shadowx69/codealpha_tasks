# Social 2026 🌐

A lightweight full-stack social media platform. Built with vanilla HTML/CSS/JS on the frontend and Node.js/Express on the backend, backed by a MySQL database. No frontend framework — just plain HTML pages served directly by the Express server.

---

## Features

- 🔐 **Authentication** — Register & login with session-based auth (24-hour session stored in MySQL)
- 🔒 **Route Protection** — All pages except login and register redirect unauthenticated users to `/login.html`
- 📝 **Posts** — Create text posts visible to all users on the global feed
- ❤️ **Likes** — Toggle like/unlike on any post with live count updates (no page reload)
- 💬 **Comments** — Expand and add comments to any post inline
- 👤 **User Profiles** — View any user's profile with their posts, follower/following counts, and join date
- 👥 **Follow / Unfollow** — Follow or unfollow other users directly from their profile page
- 🔍 **User Search** — Live debounced search bar in the navbar to find users by username
- 🛡️ **XSS Protection** — All user content is HTML-escaped before rendering

---

## Tech Stack

| Tech | Purpose |
|---|---|
| Node.js + Express | HTTP server & REST API |
| MySQL2 (promise) | Relational database (connection pool) |
| express-session | Session management |
| express-mysql-session | Persists sessions in the MySQL `sessions` table |
| Tailwind CSS v4 (CDN) | Styling (loaded via browser CDN, no build step) |
| Font Awesome 6 (CDN) | Icons (heart, comment) |
| Vanilla JS (Fetch API) | All client-side interactivity |

---

## Project Structure

```
Codealpha_social2026/
├── server.js          # Express server — all API routes + session + static serving
├── package.json       # Dependencies
├── db.txt             # Full MySQL schema (run this first)
├── test_db.js         # Quick DB connection test script
└── public/            # Static frontend files served by Express
    ├── login.html     # Login page (public)
    ├── register.html  # Register page (public)
    ├── feed.html      # Global post feed (protected)
    └── profile.html   # User profile page (protected)
```

---

## Database Schema

The database is **MySQL**. Run the SQL in `db.txt` to create the database and all tables.

| Table | Description |
|---|---|
| `sessions` | Server-side session store (managed by express-mysql-session) |
| `users` | Registered users (id, username, password, created_at) |
| `posts` | User posts (id, user_id, content, created_at) |
| `comments` | Comments on posts (id, post_id, user_id, content, created_at) |
| `likes` | Likes on posts — composite PK (user_id, post_id) prevents duplicates |
| `followers` | Follow relationships — composite PK (follower_id, following_id) |

---

## Getting Started

### Prerequisites
- Node.js v18+
- MySQL server running locally

### 1. Clone the repository
```bash
git clone <repo-url>
cd Codealpha_social2026
```

### 2. Setup the Database
Open MySQL and run the full contents of `db.txt`:
```sql
source db.txt
```
This creates the `social_app_2026` database and all required tables.

### 3. Install dependencies
```bash
npm install
```

### 4. Configure the database connection
Open `server.js` and update the `dbOptions` block with your MySQL credentials if different from the defaults:
```js
const dbOptions = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'your_mysql_password',
    database: 'social_app_2026'
};
```

### 5. Start the server
```bash
npm start       # production
npm run dev     # development (node --watch)
```

The app will be available at `http://localhost:3000`.  
You will be automatically redirected to `/login.html`.

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/register` | ❌ | Register a new user, auto-login via session |
| `POST` | `/api/login` | ❌ | Login and create a session |
| `POST` | `/api/logout` | ✅ | Destroy session and clear cookie |
| `GET` | `/api/me` | ✅ | Get current logged-in user (userId, username) |

### Posts
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/posts` | ✅ | Get all posts (with like counts, comment counts, user like status) |
| `POST` | `/api/posts` | ✅ | Create a new post |

### Comments
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/posts/:id/comments` | ✅ | Get all comments for a post |
| `POST` | `/api/posts/:id/comments` | ✅ | Add a comment to a post |

### Likes
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/posts/:id/like` | ✅ | Toggle like/unlike on a post |

### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/users/search?q=` | ✅ | Search users by username (max 10 results) |
| `GET` | `/api/users/:id` | ✅ | Get user profile, posts, follower/following counts |
| `POST` | `/api/users/:id/follow` | ✅ | Toggle follow/unfollow a user |
