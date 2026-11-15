const Reservation = require('../models/Reservation');
const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.createReservation = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ success: false, message: 'Product and quantity are required.' });
    }

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be a positive whole number.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }

    if (product.sellerId.toString() === req.user.id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot reserve your own listing.' });
    }

    if (product.status !== 'active') {
      return res.status(400).json({ success: false, message: 'This listing is no longer active.' });
    }

    if (new Date(product.availabilityDeadline) <= new Date()) {
      return res.status(400).json({ success: false, message: 'This listing has expired.' });
    }

    if (product.availableQuantity < qty) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.availableQuantity} unit(s) available. Please reduce your quantity.`,
      });
    }

    const reservation = await Reservation.create({
      buyerId: req.user.id,
      sellerId: product.sellerId,
      productId,
      quantity: qty,
      totalAmount: product.discountedPrice * qty,
      status: 'pending',
    });

    await reservation.populate([
      { path: 'productId', select: 'name category pickupAddress discountedPrice' },
      { path: 'sellerId', select: 'name businessName' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Reservation request submitted. Waiting for seller confirmation.',
      reservation,
    });
  } catch (err) {
    console.error('Create reservation error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

exports.getReservationsByBuyer = async (req, res) => {
  try {
    const reservations = await Reservation.find({ buyerId: req.user.id })
      .populate('productId', 'name category pickupAddress discountedPrice availabilityDeadline')
      .populate('sellerId', 'name businessName address')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, reservations });
  } catch (err) {
    console.error('Get buyer reservations error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getReservationsBySeller = async (req, res) => {
  try {
    const reservations = await Reservation.find({ sellerId: req.user.id })
      .populate('productId', 'name category pickupAddress discountedPrice availableQuantity availabilityDeadline')
      .populate('buyerId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, reservations });
  } catch (err) {
    console.error('Get seller reservations error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.updateReservationStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    const reservation = await Reservation.findById(id).session(session);
    if (!reservation) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Reservation not found.' });
    }

    const isSeller = reservation.sellerId.toString() === req.user.id.toString();
    const isBuyer = reservation.buyerId.toString() === req.user.id.toString();

    if (!isSeller && !isBuyer) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ success: false, message: 'You are not authorized to modify this reservation.' });
    }

    const currentStatus = reservation.status;

    if (status === 'accepted') {
      if (!isSeller) {
        await session.abortTransaction();
        session.endSession();
        return res.status(403).json({ success: false, message: 'Only the seller can accept reservations.' });
      }
      if (currentStatus !== 'pending') {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ success: false, message: `Cannot accept a reservation that is already ${currentStatus}.` });
      }

      // Atomically decrement stock — only if sufficient quantity available
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: reservation.productId,
          availableQuantity: { $gte: reservation.quantity },
        },
        {
          $inc: {
            availableQuantity: -reservation.quantity,
            reservedQuantity: reservation.quantity,
          },
        },
        { new: true, session }
      );

      if (!updatedProduct) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock to accept this reservation. The available quantity may have changed.',
        });
      }

      reservation.status = 'accepted';

    } else if (status === 'rejected') {
      if (!isSeller) {
        await session.abortTransaction();
        session.endSession();
        return res.status(403).json({ success: false, message: 'Only the seller can reject reservations.' });
      }
      if (currentStatus !== 'pending') {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ success: false, message: `Cannot reject a reservation that is already ${currentStatus}.` });
      }
      reservation.status = 'rejected';

    } else if (status === 'cancelled') {
      if (!isBuyer) {
        await session.abortTransaction();
        session.endSession();
        return res.status(403).json({ success: false, message: 'Only the buyer can cancel reservations.' });
      }
      if (currentStatus === 'collected') {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ success: false, message: 'A collected reservation cannot be cancelled.' });
      }
      if (currentStatus === 'rejected') {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ success: false, message: 'This reservation has already been rejected.' });
      }
      if (!['pending', 'accepted'].includes(currentStatus)) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ success: false, message: `Cannot cancel a ${currentStatus} reservation.` });
      }

      // If accepted, return the reserved stock
      if (currentStatus === 'accepted') {
        await Product.findByIdAndUpdate(
          reservation.productId,
          {
            $inc: {
              availableQuantity: reservation.quantity,
              reservedQuantity: -reservation.quantity,
            },
          },
          { session }
        );
      }

      reservation.status = 'cancelled';

    } else if (status === 'collected') {
      if (!isSeller) {
        await session.abortTransaction();
        session.endSession();
        return res.status(403).json({ success: false, message: 'Only the seller can mark orders as collected.' });
      }
      if (currentStatus !== 'accepted') {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ success: false, message: 'Only accepted reservations can be marked as collected.' });
      }

      // Decrement reservedQuantity (stock was already decremented on accept)
      await Product.findByIdAndUpdate(
        reservation.productId,
        { $inc: { reservedQuantity: -reservation.quantity } },
        { session }
      );

      reservation.status = 'collected';
      reservation.collectedAt = new Date();

    } else {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Invalid status transition.' });
    }

    await reservation.save({ session });
    await session.commitTransaction();
    session.endSession();

    // Populate for response
    await reservation.populate([
      { path: 'productId', select: 'name category pickupAddress discountedPrice' },
      { path: 'buyerId', select: 'name email' },
      { path: 'sellerId', select: 'name businessName' },
    ]);

    res.json({
      success: true,
      message: `Reservation ${status} successfully.`,
      reservation,
    });
  } catch (err) {
    try {
      await session.abortTransaction();
    } catch (_) {}
    session.endSession();
    console.error('Update reservation status error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};
