const mysql = require('mysql2/promise');

async function test() {
    const pool = mysql.createPool({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'sql123',
        database: 'social_app_2026'
    });

    const searchPattern = `%Alice%`;
    const [users] = await pool.query(
        'SELECT id, username FROM users WHERE username LIKE ? LIMIT 10',
        [searchPattern]
    );
    console.log(users);
    process.exit(0);
}
test();
