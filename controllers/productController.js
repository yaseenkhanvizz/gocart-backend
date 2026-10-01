const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: { message: 'Product not found', status: 404 } });
    }
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: { message: 'Product not found', status: 404 } });
    }
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ error: { message: 'Product not found', status: 404 } });
    }
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Toggle product stock
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
exports.toggleStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.inStock = !product.inStock;
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: { message: 'Product not found', status: 404 } });
    }
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Upload product image
// @route   POST /api/products/:id/images
// @access  Private/Admin
exports.uploadProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // In a real app, you would upload to cloud storage
      // For now, just use the file path or URL from request
      if (req.file) {
        product.images.push(req.file.path);
      } else if (req.body.imageUrl) {
        product.images.push(req.body.imageUrl);
      }
      
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: { message: 'Product not found', status: 404 } });
    }
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Delete product image
// @route   DELETE /api/products/:id/images/:imageId
// @access  Private/Admin
exports.deleteProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.images = product.images.filter((img, index) => index !== parseInt(req.params.imageId));
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: { message: 'Product not found', status: 404 } });
    }
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};
