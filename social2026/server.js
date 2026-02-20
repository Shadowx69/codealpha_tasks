const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const port = 3000;

// Database Options
const dbOptions = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'sql123',
    database: 'social_app_2026'
};

// Create a database connection pool
const pool = mysql.createPool({
    ...dbOptions,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Configure session store
const sessionStore = new MySQLStore({
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 86400000,
    createDatabaseTable: true
}, pool);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    key: 'social_session_cookie',
    secret: 'super-secret-key-2026',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 86400000,
        httpOnly: true,
        secure: false // Set to true if using HTTPS
    }
}));

// Route Protection Middleware for Static HTML Pages
app.use((req, res, next) => {
    if (req.path.endsWith('.html') || req.path === '/') {
        const publicPages = ['/login.html', '/register.html'];
        if (publicPages.includes(req.path)) {
            return next();
        }
        if (!req.session || !req.session.userId) {
            return res.redirect('/login.html');
        }
    }
    next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Authentication Middleware
const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// ==========================================
// API ROUTES
// ==========================================

// Register
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Plain text password
        const [result] = await pool.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, password]
        );

        req.session.userId = result.insertId;
        req.session.username = username;
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Username already exists' });
        }
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const [users] = await pool.query(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        req.session.userId = user.id;
        req.session.username = user.username;
        res.json({ message: 'Logged in successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.clearCookie('social_session_cookie');
        res.json({ message: 'Logged out successfully' });
    });
});

// Get Current User
app.get('/api/me', requireAuth, (req, res) => {
    res.json({ userId: req.session.userId, username: req.session.username });
});

// Global Feed (Posts with comment counts and current user like status)
app.get('/api/posts', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        const query = `
            SELECT 
                p.id, 
                p.content, 
                p.created_at, 
                u.username,
                u.id as author_id,
                (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) as comment_count,
                (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) as like_count,
                EXISTS(SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = ?) as user_liked
            FROM posts p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
        `;
        const [posts] = await pool.query(query, [userId]);
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create Post
app.post('/api/posts', requireAuth, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ error: 'Content is required' });

        const [result] = await pool.query(
            'INSERT INTO posts (user_id, content) VALUES (?, ?)',
            [req.session.userId, content]
        );
        res.status(201).json({ message: 'Post created', postId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add Comment
app.post('/api/posts/:id/comments', requireAuth, async (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;
        if (!content) return res.status(400).json({ error: 'Content is required' });

        await pool.query(
            'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
            [postId, req.session.userId, content]
        );
        res.status(201).json({ message: 'Comment added' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get Comments for a Post
app.get('/api/posts/:id/comments', requireAuth, async (req, res) => {
    try {
        const postId = req.params.id;
        const [comments] = await pool.query(
            `SELECT c.id, c.content, c.created_at, u.username 
             FROM comments c 
             JOIN users u ON c.user_id = u.id 
             WHERE c.post_id = ? 
             ORDER BY c.created_at ASC`,
            [postId]
        );
        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Toggle Like
app.post('/api/posts/:id/like', requireAuth, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.session.userId;

        const [likes] = await pool.query('SELECT * FROM likes WHERE user_id = ? AND post_id = ?', [userId, postId]);

        if (likes.length > 0) {
            // Unlike
            await pool.query('DELETE FROM likes WHERE user_id = ? AND post_id = ?', [userId, postId]);
            res.json({ message: 'Post unliked', liked: false });
        } else {
            // Like
            await pool.query('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [userId, postId]);
            res.json({ message: 'Post liked', liked: true });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search Users
app.get('/api/users/search', requireAuth, async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.json([]);

        const searchPattern = `%${query}%`;
        const [users] = await pool.query(
            'SELECT id, username FROM users WHERE username LIKE ? LIMIT 10',
            [searchPattern]
        );
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get User Profile (Posts and follow status)
app.get('/api/users/:id', requireAuth, async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const currentUserId = req.session.userId;

        const [users] = await pool.query('SELECT id, username, created_at FROM users WHERE id = ?', [targetUserId]);
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });
        const user = users[0];

        // Check if current user follows target user
        const [follows] = await pool.query('SELECT * FROM followers WHERE follower_id = ? AND following_id = ?', [currentUserId, targetUserId]);
        user.is_followed = follows.length > 0;
        user.is_self = currentUserId == targetUserId;

        // Get follower/following counts
        const [[followersCount]] = await pool.query('SELECT COUNT(*) as count FROM followers WHERE following_id = ?', [targetUserId]);
        const [[followingCount]] = await pool.query('SELECT COUNT(*) as count FROM followers WHERE follower_id = ?', [targetUserId]);
        user.followers_count = followersCount.count;
        user.following_count = followingCount.count;

        // Get user's posts
        const query = `
            SELECT 
                p.id, 
                p.content, 
                p.created_at, 
                (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) as comment_count,
                (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) as like_count,
                EXISTS(SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = ?) as user_liked
            FROM posts p
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC
        `;
        const [posts] = await pool.query(query, [currentUserId, targetUserId]);

        res.json({ user, posts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Toggle Follow
app.post('/api/users/:id/follow', requireAuth, async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const currentUserId = req.session.userId;

        if (targetUserId == currentUserId) {
            return res.status(400).json({ error: 'Cannot follow yourself' });
        }

        const [follows] = await pool.query('SELECT * FROM followers WHERE follower_id = ? AND following_id = ?', [currentUserId, targetUserId]);

        if (follows.length > 0) {
            // Unfollow
            await pool.query('DELETE FROM followers WHERE follower_id = ? AND following_id = ?', [currentUserId, targetUserId]);
            res.json({ message: 'Unfollowed', followed: false });
        } else {
            // Follow
            await pool.query('INSERT INTO followers (follower_id, following_id) VALUES (?, ?)', [currentUserId, targetUserId]);
            res.json({ message: 'Followed', followed: true });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a catch-all route to serve login.html for root or handle unauthenticated users?
// Will do it statically. So simply:
app.get('/', (req, res) => {
    if (req.session && req.session.userId) {
        res.redirect('/feed.html');
    } else {
        res.redirect('/login.html');
    }
});

// Start Server
app.listen(port, () => {
    console.log('Server is running on http://localhost:' + port);
});
