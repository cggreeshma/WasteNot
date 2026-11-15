const express = require('express');
const router = express.Router();
const { getSellerStats, getBuyerStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const { sellerOnly, buyerOnly } = require('../middleware/roleCheck');

router.get('/seller', protect, sellerOnly, getSellerStats);
router.get('/buyer', protect, buyerOnly, getBuyerStats);

module.exports = router;
