import db from '../db.js'; // Assuming you have a db.js file for MySQL connection setup

export const addCategory = async (req, res) => {
    const { CategoryName, Description } = req.body;

    try {
        // Check if the Category already exists
        const [existingCategory] = await db.promise().query(
            'SELECT * FROM Categories WHERE CategoryName = ?',
            [CategoryName]
        );
        if (existingCategory.length > 0) {
            return res.status(400).json({ message: 'Category already exists.' });
        }

        // Insert the Category into the database
        await db.promise().query(
            'INSERT INTO Categories (CategoryName, Description) VALUES (?, ?)',
            [CategoryName, Description]
        );


        res.status(201).json({ message: 'Category Inserted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};


export const updateCategory = async (req, res) => {
    const { CategoryID, CategoryName, Description } = req.body;

    try {
        // Check if the CategoryName already exists for another category
        const [existingCategory] = await db.promise().query(
            'SELECT * FROM Categories WHERE CategoryName = ? AND CategoryID != ?',
            [CategoryName, CategoryID]
        );
        if (existingCategory.length > 0) {
            return res.status(400).json({ message: 'Category already exists.' });
        }

        // Update the category in the database
        await db.promise().query(
            'UPDATE Categories SET CategoryName = ?, Description = ? WHERE CategoryID = ?',
            [CategoryName, Description, CategoryID]
        );

        res.status(200).json({ message: 'Category updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const deleteCategory = async (req, res) => {
    const { CategoryID } = req.body;

    try {
        // Check if the category exists
        const [existingCategory] = await db.promise().query('SELECT * FROM Categories WHERE CategoryID = ?', [CategoryID]);
        if (existingCategory.length === 0) {
            return res.status(400).json({ message: 'Category doesnot exists.' });
        }

        // Delete the category from the database
        await db.promise().query('DELETE FROM Categories WHERE CategoryID = ?', [CategoryID]);
        res.status(200).json({ message: 'Category deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};
export const addProduct = async (req, res) => {
    const { ProductName, Description, Price, CategoryID, Cover, Stock } = req.body;

    try {
        // Check if the product already exists
        const [existingProduct] = await db.promise().query('SELECT * FROM Products WHERE ProductName = ?', [ProductName]);
        if (existingProduct.length > 0) {
            return res.status(400).json({ message: 'Product already exists.' });
        }

        // Insert the product into the database, including Cover and Stock
        await db.promise().query(
            'INSERT INTO Products (ProductName, Description, Price, CategoryID, Cover, Stock) VALUES (?, ?, ?, ?, ?, ?)',
            [ProductName, Description, Price, CategoryID, Cover, Stock || 0]
        );

        res.status(201).json({ message: 'Product inserted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const updateProduct = async (req, res) => {
    const { ProductID, ProductName, Description, Price, CategoryID, Cover, Stock } = req.body;

    try {
        // Check if the product exists
        const [existingProduct] = await db.promise().query('SELECT * FROM Products WHERE ProductID = ?', [ProductID]);
        if (existingProduct.length === 0) {
            return res.status(400).json({ message: 'Product does not exist.' });
        }

        // Update the product in the database
        await db.promise().query(
            'UPDATE Products SET ProductName = ?, Description = ?, Price = ?, CategoryID = ?, Cover = ?, Stock = ? WHERE ProductID = ?',
            [ProductName, Description, Price, CategoryID, Cover, Stock, ProductID]
        );

        res.status(200).json({ message: 'Product updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const deleteProduct = async (req, res) => {
    const { ProductID } = req.body;

    try {
        // Check if the product exists
        const [existingProduct] = await db.promise().query('SELECT * FROM Products WHERE ProductID = ?', [ProductID]);
        if (existingProduct.length === 0) {
            return res.status(400).json({ message: 'Product does not exist.' });
        }

        // Delete the product from the database
        await db.promise().query('DELETE FROM Products WHERE ProductID = ?', [ProductID]);
        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};