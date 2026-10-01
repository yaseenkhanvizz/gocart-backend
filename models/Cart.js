const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
}, { _id: true });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  coupon: {
    code: {
      type: String,
      default: ''
    },
    discount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Calculate total price
cartSchema.methods.getTotalPrice = function() {
  return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Calculate total after discount
cartSchema.methods.getTotalAfterDiscount = function() {
  const total = this.getTotalPrice();
  return total - this.coupon.discount;
};

module.exports = mongoose.model('Cart', cartSchema);
