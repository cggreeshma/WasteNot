const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  getSellerProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { sellerOnly } = require('../middleware/roleCheck');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Seller protected routes
router.get('/seller/my-listings', protect, sellerOnly, getSellerProducts);
router.post('/', protect, sellerOnly, createProduct);
router.put('/:id', protect, sellerOnly, updateProduct);
router.delete('/:id', protect, sellerOnly, deleteProduct);

module.exports = router;
