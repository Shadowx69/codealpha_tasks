import db from '../db.js';

export const getUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const [users] = await db.promise().query('SELECT UserID, UserName, Email, Address FROM Users WHERE UserID = ?', [userId]);
        if (users.length === 0) return res.status(404).json({ message: "User not found" });
        res.status(200).json(users[0]);
    } catch (err) {
        res.status(500).json(err);
    }
}

export const updateAddress = async (req, res) => {
    const userId = req.params.id;
    const { address, UserName } = req.body; // Accept UserName as well
    try {
        // Update Address and UserName
        await db.promise().query('UPDATE Users SET Address = ?, UserName = ? WHERE UserID = ?', [address, UserName, userId]);
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
        res.status(500).json(err);
    }
}
