const express = require('express');
const { adminRegister ,adminLogin} = require('../controllers/adminAuthController');
const { createProduct, getProducts } = require('../controllers/productController');
const authenticateUser = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');


const router = express.Router();

router.post("/signup", adminRegister);
router.post("/login", adminLogin);
router.post('/create', authenticateUser, upload.single('image'), createProduct);
router.get('/getProducts', getProducts);


module.exports = router;