const express = require('express');
const { createProduct, getProducts } = require('../controllers/productController');
const authenticateUser = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Import Multer middleware

const router = express.Router();

router.post('/create', authenticateUser, upload.single('image'), createProduct); // Admin only
router.get('/all', getProducts); // Public

module.exports = router;
