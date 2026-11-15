const express = require('express');
const router = express.Router();
const {
  createReservation,
  getReservationsByBuyer,
  getReservationsBySeller,
  updateReservationStatus,
} = require('../controllers/reservationController');
const { protect } = require('../middleware/auth');
const { buyerOnly, sellerOnly } = require('../middleware/roleCheck');

router.post('/', protect, buyerOnly, createReservation);
router.get('/my', protect, buyerOnly, getReservationsByBuyer);
router.get('/incoming', protect, sellerOnly, getReservationsBySeller);
router.put('/:id/status', protect, updateReservationStatus);

module.exports = router;
