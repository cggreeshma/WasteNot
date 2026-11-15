const Product = require('../models/Product');
const Reservation = require('../models/Reservation');
const mongoose = require('mongoose');

// SELLER DASHBOARD STATISTICS
exports.getSellerStats = async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.user.id);

    // Automatically expire old listings
    await Product.updateMany(
      {
        sellerId: req.user.id,
        availabilityDeadline: { $lt: new Date() },
        status: 'active'
      },
      {
        $set: { status: 'expired' }
      }
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

      Product.countDocuments({
        sellerId: req.user.id,
        status: 'active'
      }),

      Reservation.countDocuments({
        sellerId: req.user.id,
        status: 'pending'
      }),

      Reservation.countDocuments({
        sellerId: req.user.id,
        status: 'accepted'
      }),

      Reservation.countDocuments({
        sellerId: req.user.id,
        status: 'collected'
      }),

      // Calculate total revenue
      Reservation.aggregate([
        {
          $match: {
            sellerId,
            status: 'collected'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' }
          }
        }
      ]),

      // Recent reservations
      Reservation.find({ sellerId: req.user.id })
        .populate('productId', 'name category')
        .populate('buyerId', 'name email')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      // Recent listings
      Product.find({ sellerId: req.user.id })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    const totalReservations =
      pendingReservations +
      acceptedReservations +
      collectedReservations;

    res.json({
      success: true,

      stats: {
        totalListings,
        activeListings,
        pendingReservations,
        acceptedReservations,
        collectedReservations,
        totalReservations,
        totalRevenue,
        revenue: totalRevenue,
        recentReservations,
        recentListings,
      },
    });

  } catch (err) {
    console.error('Get seller stats error:', err);

    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};


// BUYER DASHBOARD STATISTICS
exports.getBuyerStats = async (req, res) => {
  try {

    const [
      total,
      pending,
      accepted,
      collected,
      recentActivity,
      collectedReservations,
    ] = await Promise.all([

      // Total reservations
      Reservation.countDocuments({
        buyerId: req.user.id
      }),

      // Pending reservations
      Reservation.countDocuments({
        buyerId: req.user.id,
        status: 'pending'
      }),

      // Accepted reservations
      Reservation.countDocuments({
        buyerId: req.user.id,
        status: 'accepted'
      }),

      // Collected reservations
      Reservation.countDocuments({
        buyerId: req.user.id,
        status: 'collected'
      }),

      // Recent buyer activity
      Reservation.find({
        buyerId: req.user.id
      })
        .populate(
          'productId',
          'name category pickupAddress originalPrice discountedPrice'
        )
        .populate('sellerId', 'name businessName')
        .sort({ updatedAt: -1 })
        .limit(5)
        .lean(),

      // Fetch ALL collected reservations for savings calculation
      Reservation.find({
        buyerId: req.user.id,
        status: 'collected'
      })
        .populate(
          'productId',
          'originalPrice discountedPrice'
        )
        .lean(),

    ]);

    // Calculate total money saved
    const totalSaved = collectedReservations.reduce(
      (totalSavings, reservation) => {

        const product = reservation.productId;

        if (!product) {
          return totalSavings;
        }

        const originalPrice = product.originalPrice || 0;
        const discountedPrice = product.discountedPrice || 0;

        const savingsPerItem =
          Math.max(0, originalPrice - discountedPrice);

        const reservationSavings =
          savingsPerItem * reservation.quantity;

        return totalSavings + reservationSavings;

      },
      0
    );

    res.json({
      success: true,

      stats: {
        total,
        pending,
        accepted,
        collected,
        totalSaved,
        recentActivity,
      },
    });

  } catch (err) {
    console.error('Get buyer stats error:', err);

    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};