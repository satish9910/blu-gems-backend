const express = require('express');
const { userRegister,userLogin,getProducts, getLatestProducts } = require('../controllers/authController');
const { get } = require('mongoose');
const { addcart, getCart } = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');


const router = express.Router();


router.post('/signup',userRegister);
router.post('/login', userLogin);
router.get('/get-products',getProducts);
router.get("/latest-products",getLatestProducts);
router.post("/add-cart",authMiddleware,addcart);
router.get("/get-cart",authMiddleware,getCart);



module.exports = router;