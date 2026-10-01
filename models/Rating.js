const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  review: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Ensure one rating per user per product
ratingSchema.index({ user: 1, product: 1 }, { unique: true });

// Update product average rating after saving
ratingSchema.post('save', async function() {
  const Product = mongoose.model('Product');
  const ratings = await mongoose.model('Rating').find({ product: this.product });
  
  if (ratings.length > 0) {
    const average = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    await Product.findByIdAndUpdate(this.product, {
      averageRating: Math.round(average * 10) / 10,
      numReviews: ratings.length
    });
  }
});

// Update product average rating after deleting
ratingSchema.post('deleteOne', { document: true, query: false }, async function() {
  const Product = mongoose.model('Product');
  const ratings = await mongoose.model('Rating').find({ product: this.product });
  
  if (ratings.length > 0) {
    const average = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    await Product.findByIdAndUpdate(this.product, {
      averageRating: Math.round(average * 10) / 10,
      numReviews: ratings.length
    });
  } else {
    await Product.findByIdAndUpdate(this.product, {
      averageRating: 0,
      numReviews: 0
    });
  }
});

module.exports = mongoose.model('Rating', ratingSchema);
