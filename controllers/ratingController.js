const Rating = require('../models/Rating');

// @desc    Get product ratings
// @route   GET /api/ratings/product/:productId
// @access  Public
exports.getProductRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ product: req.params.productId })
      .populate('user', 'name avatar');
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Get user rating for product
// @route   GET /api/ratings/user/:productId
// @access  Private
exports.getUserRating = async (req, res) => {
  try {
    const rating = await Rating.findOne({
      user: req.user._id,
      product: req.params.productId
    });

    if (rating) {
      res.json(rating);
    } else {
      res.json(null);
    }
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Submit rating
// @route   POST /api/ratings
// @access  Private
exports.submitRating = async (req, res) => {
  try {
    const { product, rating, review } = req.body;

    // Check if rating already exists
    let existingRating = await Rating.findOne({
      user: req.user._id,
      product
    });

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.review = review;
      const updatedRating = await existingRating.save();
      res.json(updatedRating);
    } else {
      const newRating = await Rating.create({
        user: req.user._id,
        product,
        rating,
        review
      });
      res.status(201).json(newRating);
    }
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Update rating
// @route   PUT /api/ratings/:ratingId
// @access  Private
exports.updateRating = async (req, res) => {
  try {
    const rating = await Rating.findOne({
      _id: req.params.ratingId,
      user: req.user._id
    });

    if (rating) {
      Object.assign(rating, req.body);
      const updatedRating = await rating.save();
      res.json(updatedRating);
    } else {
      res.status(404).json({ error: { message: 'Rating not found', status: 404 } });
    }
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Delete rating
// @route   DELETE /api/ratings/:ratingId
// @access  Private
exports.deleteRating = async (req, res) => {
  try {
    const rating = await Rating.findOne({
      _id: req.params.ratingId,
      user: req.user._id
    });

    if (rating) {
      await rating.deleteOne();
      res.json({ message: 'Rating removed' });
    } else {
      res.status(404).json({ error: { message: 'Rating not found', status: 404 } });
    }
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Get average rating
// @route   GET /api/ratings/average/:productId
// @access  Public
exports.getAverageRating = async (req, res) => {
  try {
    const ratings = await Rating.find({ product: req.params.productId });

    if (ratings.length === 0) {
      return res.json({ average: 0, count: 0 });
    }

    const average = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    res.json({
      average: Math.round(average * 10) / 10,
      count: ratings.length
    });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};
