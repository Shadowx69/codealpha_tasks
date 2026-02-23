import db from '../db.js';

export const getAllProducts = async (_req, res) => {
    try {
        const [products] = await db.promise().query('SELECT * FROM ecommerce.Products');
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};  