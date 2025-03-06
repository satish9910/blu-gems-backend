const Product = require('../models/productModel');

// Create Product (Admin Only)
const createProduct = async (req, res) => {
    try {
        const { name, price, description, discount, stock, category } = req.body;

        // Check if the user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admins only' });
        }

        // Validate required fields
        if (!name || !price || !description || !discount || !stock || !category) {
            return res.status(400).json({ error: 'Please provide all required details' });
        }

        // Handle image upload
        const image = req.file ? `/uploads/${req.file.filename}` : '';

        // Create the product
        const product = await Product.create({ name, price, description, discount, stock, image, category });

        res.status(201).json({
            message: 'Product created successfully',
            product,
        });

    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get All Products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            message: 'All products',
            products,
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { createProduct, getProducts };
