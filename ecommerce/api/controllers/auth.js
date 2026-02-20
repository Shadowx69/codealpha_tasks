import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js'; // Assuming you have a db.js file for MySQL connection setup

// User Registration
export const register = async (req, res) => {
    const { UserName, Email, Password } = req.body;

    try {
        // Check if the user already exists
        const [existingUser] = await db.promise().query('SELECT * FROM Users WHERE Email = ?', [Email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        // Insert the user into the database
        await db.promise().query(
            'INSERT INTO Users (UserName, Email, PasswordHash) VALUES (?, ?, ?)',
            [UserName, Email, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// User Login
// User Login (updated to check both Users and Admin tables)
export const login = async (req, res) => {
    const { Email, Password } = req.body;

    try {
        // Check if the user exists in the Users table
        const [user] = await db.promise().query('SELECT * FROM Users WHERE Email = ?', [Email]);

        if (user.length > 0) {
            // Verify the password for regular users
            const isMatch = await bcrypt.compare(Password, user[0].PasswordHash);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials.' });
            }

            // Generate a JWT token
            const token = jwt.sign({ UserID: user[0].UserID }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            return res.status(200).json({
                message: 'Logged in successfully.',
                user: {
                    UserID: user[0].UserID, // Added UserID
                    UserName: user[0].UserName,
                    Email: user[0].Email,
                    isAdmin: false,
                },
            });
        }

        // Check if the admin exists in the Admin table
        const [admin] = await db.promise().query('SELECT * FROM Admin WHERE Email = ?', [Email]);

        if (admin.length > 0) {
            // Directly compare plain-text password
            if (Password !== admin[0].PasswordHash) {
                return res.status(400).json({ message: 'Invalid credentials.' });
            }

            // Generate a JWT token for admin
            const token = jwt.sign({ AdminID: admin[0].AdminID }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            return res.status(200).json({
                message: 'Logged in successfully as Admin.',
                user: {
                    UserName: admin[0].AdminName,
                    Email: admin[0].Email,
                    isAdmin: true,
                },
            });
        }

        // If neither user nor admin is found
        return res.status(404).json({ message: 'User or Admin not found.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// User Logout
export const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully.' });
};
