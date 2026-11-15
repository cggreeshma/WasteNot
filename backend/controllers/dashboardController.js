const Product = require('../models/Product');
const Reservation = require('../models/Reservation');
const mongoose = require('mongoose');

exports.getSellerStats = async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.user.id);

    // Auto-expire stale listings
    await Product.updateMany(
      { sellerId: req.user.id, availabilityDeadline: { $lt: new Date() }, status: 'active' },
      { $set: { status: 'expired' } }
    );

    const [
      totalListings,
      activeListings,
      pendingReservations,
      acceptedReservations,
      collectedReservations,
      revenueResult,
      recentReservations,
      recentListings,
    ] = await Promise.all([
      Product.countDocuments({ sellerId: req.user.id }),
      Product.countDocuments({ sellerId: req.user.id, status: 'active' }),
      Reservation.countDocuments({ sellerId: req.user.id, status: 'pending' }),
      Reservation.countDocuments({ sellerId: req.user.id, status: 'accepted' }),
      Reservation.countDocuments({ sellerId: req.user.id, status: 'collected' }),
      Reservation.aggregate([
        { $match: { sellerId, status: 'collected' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Reservation.find({ sellerId: req.user.id })
        .populate('productId', 'name category')
        .populate('buyerId', 'name email')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Product.find({ sellerId: req.user.id })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    res.json({
      success: true,
      stats: {
        totalListings,
        activeListings,
        pendingReservations,
        acceptedReservations,
        collectedReservations,
        totalRevenue: revenueResult[0]?.total || 0,
        recentReservations,
        recentListings,
      },
    });
  } catch (err) {
    console.error('Get seller stats error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getBuyerStats = async (req, res) => {
  try {
    const [total, pending, accepted, collected, recentActivity] = await Promise.all([
      Reservation.countDocuments({ buyerId: req.user.id }),
      Reservation.countDocuments({ buyerId: req.user.id, status: 'pending' }),
      Reservation.countDocuments({ buyerId: req.user.id, status: 'accepted' }),
      Reservation.countDocuments({ buyerId: req.user.id, status: 'collected' }),
      Reservation.find({ buyerId: req.user.id })
        .populate('productId', 'name category pickupAddress discountedPrice')
        .populate('sellerId', 'name businessName')
        .sort({ updatedAt: -1 })
        .limit(5)
        .lean(),
    ]);

    res.json({
      success: true,
      stats: { total, pending, accepted, collected, recentActivity },
    });
  } catch (err) {
    console.error('Get buyer stats error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
