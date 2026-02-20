import db from '../db.js';

export const getAllCategories = async (_req, res) => {
    try {
        const [products] = await db.promise().query('SELECT * FROM ecommerce.Categories');
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};  