const Product = require('../models/Product');

const autoExpireProducts = async (query = {}) => {
  await Product.updateMany(
    { ...query, availabilityDeadline: { $lt: new Date() }, status: 'active' },
    { $set: { status: 'expired' } }
  );
};

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      originalPrice,
      discountedPrice,
      availableQuantity,
      pickupAddress,
      availabilityDeadline,
    } = req.body;

    // Required fields
    if (!name || !category || !originalPrice || !discountedPrice || !availableQuantity || !pickupAddress || !availabilityDeadline) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided.' });
    }

    const origPrice = Number(originalPrice);
    const discPrice = Number(discountedPrice);
    const qty = Number(availableQuantity);

    if (isNaN(origPrice) || origPrice <= 0) {
      return res.status(400).json({ success: false, message: 'Original price must be greater than zero.' });
    }
    if (isNaN(discPrice) || discPrice <= 0) {
      return res.status(400).json({ success: false, message: 'Discounted price must be greater than zero.' });
    }
    if (discPrice >= origPrice) {
      return res.status(400).json({ success: false, message: 'Discounted price must be less than the original price.' });
    }
    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be a positive whole number.' });
    }

    const deadline = new Date(availabilityDeadline);
    if (isNaN(deadline.getTime()) || deadline <= new Date()) {
      return res.status(400).json({ success: false, message: 'Availability deadline must be a future date and time.' });
    }

    const product = await Product.create({
      sellerId: req.user.id,
      name: name.trim(),
      description: description ? description.trim() : '',
      category,
      originalPrice: origPrice,
      discountedPrice: discPrice,
      availableQuantity: qty,
      pickupAddress: pickupAddress.trim(),
      availabilityDeadline: deadline,
      status: 'active',
    });

    res.status(201).json({ success: true, message: 'Food listing created successfully.', product });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { search, category, sortBy, page = 1, limit = 12 } = req.query;

    // Auto-expire stale listings
    await autoExpireProducts();

    const query = {
      status: 'active',
      availabilityDeadline: { $gt: new Date() },
      availableQuantity: { $gt: 0 },
    };

    if (search && search.trim()) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === 'price_asc') sortOption = { discountedPrice: 1 };
    else if (sortBy === 'price_desc') sortOption = { discountedPrice: -1 };
    else if (sortBy === 'deadline') sortOption = { availabilityDeadline: 1 };
    else if (sortBy === 'newest') sortOption = { createdAt: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;
    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate('sellerId', 'name businessName address')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('sellerId', 'name businessName address')
      .lean();

    if (!product) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }

    res.json({ success: true, product });
  } catch (err) {
    console.error('Get product by ID error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getSellerProducts = async (req, res) => {
  try {
    await autoExpireProducts({ sellerId: req.user.id });

    const products = await Product.find({ sellerId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, products });
  } catch (err) {
    console.error('Get seller products error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }

    if (product.sellerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only edit your own listings.' });
    }

    const {
      name,
      description,
      category,
      originalPrice,
      discountedPrice,
      availableQuantity,
      pickupAddress,
      availabilityDeadline,
      status,
    } = req.body;

    const updateData = {};

    if (name && name.trim()) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (category) updateData.category = category;
    if (pickupAddress && pickupAddress.trim()) updateData.pickupAddress = pickupAddress.trim();
    if (status && ['active', 'inactive'].includes(status)) updateData.status = status;

    if (originalPrice !== undefined) {
      const orig = Number(originalPrice);
      if (isNaN(orig) || orig <= 0) {
        return res.status(400).json({ success: false, message: 'Original price must be greater than zero.' });
      }
      updateData.originalPrice = orig;
    }

    if (discountedPrice !== undefined) {
      const disc = Number(discountedPrice);
      if (isNaN(disc) || disc <= 0) {
        return res.status(400).json({ success: false, message: 'Discounted price must be greater than zero.' });
      }
      updateData.discountedPrice = disc;
    }

    const finalOrig = updateData.originalPrice ?? product.originalPrice;
    const finalDisc = updateData.discountedPrice ?? product.discountedPrice;
    if (finalDisc >= finalOrig) {
      return res.status(400).json({ success: false, message: 'Discounted price must be less than the original price.' });
    }

    if (availableQuantity !== undefined) {
      const qty = Number(availableQuantity);
      if (!Number.isInteger(qty) || qty < 0) {
        return res.status(400).json({ success: false, message: 'Quantity must be a non-negative whole number.' });
      }
      updateData.availableQuantity = qty;
    }

    if (availabilityDeadline) {
      const deadline = new Date(availabilityDeadline);
      if (isNaN(deadline.getTime()) || deadline <= new Date()) {
        return res.status(400).json({ success: false, message: 'Availability deadline must be a future date and time.' });
      }
      updateData.availabilityDeadline = deadline;
      // Reactivate if previously expired and now given a future deadline
      if (product.status === 'expired' && updateData.status !== 'inactive') {
        updateData.status = 'active';
      }
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    res.json({ success: true, message: 'Listing updated successfully.', product: updated });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }

    if (product.sellerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only delete your own listings.' });
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Listing deleted successfully.' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
