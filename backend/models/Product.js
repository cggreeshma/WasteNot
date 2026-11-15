const mongoose = require('mongoose');

const CATEGORIES = [
  'Bakery',
  'Cooked Meals',
  'Snacks',
  'Dairy',
  'Fruits and Vegetables',
  'Packaged Food',
  'Other',
];

const productSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: '',
    },

    category: {
      type: String,
      enum: CATEGORIES,
      required: [true, 'Category is required'],
    },

    originalPrice: {
      type: Number,
      required: [true, 'Original price is required'],
      min: [0.01, 'Price must be greater than zero'],
    },

    discountedPrice: {
      type: Number,
      required: [true, 'Discounted price is required'],
      min: [0.01, 'Price must be greater than zero'],
    },

    availableQuantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },

    reservedQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    pickupAddress: {
      type: String,
      required: [true, 'Pickup address is required'],
      trim: true,
    },

    availabilityDeadline: {
      type: Date,
      required: [true, 'Availability deadline is required'],
    },

    // Cloudinary image information
    imageUrl: {
      type: String,
      default: '',
    },

    imagePublicId: {
      type: String,
      default: '',
    },

    status: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'active',
    },
  },
  { timestamps: true }
);

productSchema.index({ sellerId: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1, availabilityDeadline: 1 });
productSchema.index({ name: 'text' });

module.exports = mongoose.model('Product', productSchema);
module.exports.CATEGORIES = CATEGORIES;