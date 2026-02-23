import db from '../db.js'; // Your database connection file

// Add product to cart
export async function addToCart(req, res) {
    try {
        const { UserID, ProductName, Price, Size, Quantity, Cover } = req.body;
        
        // Validate UserID is provided
        if (!UserID) {
            return res.status(400).json({ error: 'UserID is required' });
        }
        
        await db.promise().query(
            `INSERT INTO Cart (UserID, ProductName, Price, Size, Quantity, Cover) VALUES (?, ?, ?, ?, ?, ?)`,
            [UserID, ProductName, Price, Size, Quantity, Cover]
        );
        res.status(201).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add product to cart' });
    }
}

// Get cart items
export async function getCart(req, res) {
    try {
        const { userId } = req.params;
        const [rows] = await db.promise().query(`SELECT * FROM Cart WHERE UserID = ?`, [userId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch cart items' });
    }
}

export async function clearCart(req, res) {
    try {
        await db.promise().query(
            `DELETE FROM Cart`
        );
           
        res.status(201).json({ message: 'cleared cart successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
}
