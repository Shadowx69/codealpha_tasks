import db from '../db.js';

export const buyProduct = async (req, res) => {
    const { ProductID, Quantity, UserID } = req.body;

    try {
        // Start a transaction
        await db.promise().query('START TRANSACTION');

        // Check User Address
        if (UserID) {
            const [users] = await db.promise().query('SELECT Address FROM Users WHERE UserID = ?', [UserID]);
            if (users.length === 0) {
                await db.promise().query('ROLLBACK');
                return res.status(404).json({ message: 'User not found' });
            }
            if (!users[0].Address || users[0].Address.trim() === '') {
                await db.promise().query('ROLLBACK');
                return res.status(400).json({ message: 'Please add an address to your account before purchasing.', code: 'NO_ADDRESS' });
            }
        } else {
             // If no UserID provided, we might want to block or allow guest checkout depending on requirements. 
             // For this request, "user cannot buy... without entering address linked to account", so we enforce it.
             await db.promise().query('ROLLBACK');
             return res.status(401).json({ message: 'User must be logged in.' });
        }

        // Check stock
        const [products] = await db.promise().query('SELECT Stock, ProductName FROM Products WHERE ProductID = ? FOR UPDATE', [ProductID]);
        
        if (products.length === 0) {
            await db.promise().query('ROLLBACK');
            return res.status(404).json({ message: 'Product not found' });
        }

        const product = products[0];

        if (product.Stock < Quantity) {
            await db.promise().query('ROLLBACK');
            return res.status(400).json({ message: `Insufficient stock. Only ${product.Stock} left.` });
        }

        // Deduct stock
        await db.promise().query('UPDATE Products SET Stock = Stock - ? WHERE ProductID = ?', [Quantity, ProductID]);

        // Commit transaction
        await db.promise().query('COMMIT');

        res.status(200).json({ message: 'Purchase successful', newStock: product.Stock - Quantity });
    } catch (error) {
        await db.promise().query('ROLLBACK');
        console.error('Error buying product:', error);
        res.status(500).json({ message: 'Transaction failed' });
    }
};
