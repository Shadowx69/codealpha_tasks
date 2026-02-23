import db from '../db.js';

export const getAllProductsS = async (req, res) => {
    try {
        const { search, categories, minPrice, maxPrice, sort } = req.query;

        // Base query using INNER JOIN for Products and Categories
        let query = `
            SELECT 
                p.ProductID, 
                p.ProductName, 
                p.Description, 
                p.Price, 
                p.Stock, 
                p.Cover, 
                c.CategoryName,
                o.OrderID,
                od.Quantity,
                od.Price AS OrderPrice,
                o.OrderDate
            FROM 
                ecommerce.Products p
            INNER JOIN 
                ecommerce.Categories c 
                ON p.CategoryID = c.CategoryID
            LEFT JOIN 
                ecommerce.OrderDetails od 
                ON p.ProductID = od.ProductID
            LEFT JOIN 
                ecommerce.Orders o 
                ON od.OrderID = o.OrderID
            WHERE 1=1
        `;

        // Add search filter
        if (search) {
            query += ` AND p.ProductName LIKE ?`;
        }

        // Add categories filter
        if (categories) {
            const categoryIDs = categories.split(',').map(Number).filter(Boolean);
            if (categoryIDs.length > 0) {
                query += ` AND p.CategoryID IN (${categoryIDs.join(',')})`;
            }
        }

        // Add price range filter
        if (minPrice && maxPrice) {
            query += ` AND p.Price BETWEEN ? AND ?`;
        }

        // Add sorting
        if (sort) {
            if (sort === 'asc') {
                query += ` ORDER BY p.Price ASC`;
            } else if (sort === 'desc') {
                query += ` ORDER BY p.Price DESC`;
            }
        }

        // Execute the query with parameters
        const values = [];
        if (search) values.push(`%${search}%`);
        if (minPrice && maxPrice) {
            values.push(Number(minPrice), Number(maxPrice));
        }

        const [products] = await db.promise().query(query, values);

        // LEFT JOIN: Show products with or without associated orders
        const leftJoinQuery = `
            SELECT 
                p.ProductName, 
                c.CategoryName
            FROM 
                ecommerce.Products p
            LEFT JOIN 
                ecommerce.Categories c 
                ON p.CategoryID = c.CategoryID
        `;
        const [leftJoinResult] = await db.promise().query(leftJoinQuery);

        // RIGHT JOIN: Show categories even if no products exist in them
        const rightJoinQuery = `
            SELECT 
                c.CategoryName, 
                p.ProductName
            FROM 
                ecommerce.Categories c
            RIGHT JOIN 
                ecommerce.Products p 
                ON c.CategoryID = p.CategoryID
        `;
        const [rightJoinResult] = await db.promise().query(rightJoinQuery);

        // FULL JOIN (simulated): Combine LEFT JOIN and RIGHT JOIN results
        const fullJoinQuery = `
            SELECT 
                c.CategoryName, 
                p.ProductName
            FROM 
                ecommerce.Categories c
            LEFT JOIN 
                ecommerce.Products p 
                ON c.CategoryID = p.CategoryID
            UNION
            SELECT 
                c.CategoryName, 
                p.ProductName
            FROM 
                ecommerce.Categories c
            RIGHT JOIN 
                ecommerce.Products p 
                ON c.CategoryID = p.CategoryID
        `;
        const [fullJoinResult] = await db.promise().query(fullJoinQuery);

        res.status(200).json({
            products,
            leftJoinResult,
            rightJoinResult,
            fullJoinResult,
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};
 