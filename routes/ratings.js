const express = require('express');
const router = express.Router();
const {
  getProductRatings,
  getUserRating,
  submitRating,
  updateRating,
  deleteRating,
  getAverageRating
} = require('../controllers/ratingController');
const { protect } = require('../middleware/auth');

router.get('/product/:productId', getProductRatings);
router.get('/user/:productId', protect, getUserRating);
router.get('/average/:productId', getAverageRating);
router.post('/', protect, submitRating);
router.put('/:ratingId', protect, updateRating);
router.delete('/:ratingId', protect, deleteRating);

module.exports = router;
