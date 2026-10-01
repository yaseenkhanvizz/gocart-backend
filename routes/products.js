const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleStock,
  uploadProductImage,
  deleteProductImage
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.patch('/:id/stock', protect, admin, toggleStock);
router.post('/:id/images', protect, admin, uploadProductImage);
router.delete('/:id/images/:imageId', protect, admin, deleteProductImage);

module.exports = router;
