
const Cart = require('../models/cartModel'); // Assuming you have a Cart model defined
const Product = require('../models/productModel'); // Assuming you have a Product model defined
// const userModel = require('../models/userModel'); // Assuming you have a User model defined
const addcart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user; // Assuming authentication middleware provides userId

        // console.log(productId, userId);

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if the user already has a cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Create a new cart if none exists
            cart = new Cart({
                userId,
                items: [{ product: productId, quantity: 1 }], // Always start with 1
                totalPrice: product.price, // Assuming product has a price field
            });

            await cart.save();
            return res.status(201).json({ message: 'New cart created and product added', cart });
        }

        // Check if the product is already in the cart
        const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (existingItemIndex > -1) {
            // Increase quantity by 1
            cart.items[existingItemIndex].quantity += 1;
        } else {
            // Add new product with quantity 1
            cart.items.push({ product: productId, quantity: 1 });
        }

        // Recalculate total price
        const productIds = cart.items.map(item => item.product);
        const products = await Product.find({ _id: { $in: productIds } });

        cart.totalPrice = cart.items.reduce((total, item) => {
            const itemProduct = products.find(p => p._id.toString() === item.product.toString());
            return total + (itemProduct ? itemProduct.price * item.quantity : 0);
        }, 0);

        await cart.save();
        res.status(200).json({ message: 'Product added/updated in cart', cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getCart = async (req, res) => {
    try {
      const userId = req.user;
        // Assuming authentication middleware provides userId

        const cart = await Cart.findOne({ userId }).populate('items.product', 'name price'); // Populate product details
        console.log(cart);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        return res.status(200).json(cart);


    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = {
    addcart,
    getCart
    // Add other cart-related functions here (e.g., removeItem, clearCart, etc.)
};