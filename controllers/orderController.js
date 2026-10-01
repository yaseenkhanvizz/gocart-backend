const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/user
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ error: { message: 'Order not found', status: 404 } });
    }

    // Check if user is admin or order owner
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: { message: 'Not authorized', status: 403 } });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: { message: 'Cart is empty', status: 400 } });
    }

    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.price,
      image: item.product.images[0] || ''
    }));

    const itemsPrice = cart.getTotalPrice();
    const shippingPrice = itemsPrice > 1000 ? 0 : 50;
    const taxPrice = itemsPrice * 0.18; // 18% tax
    const totalPrice = itemsPrice + shippingPrice + taxPrice - cart.coupon.discount;

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    });

    // Clear cart after order creation
    cart.items = [];
    cart.coupon = { code: '', discount: 0 };
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: { message: 'Order not found', status: 404 } });
    }

    order.status = status;

    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Cancel order
// @route   PATCH /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: { message: 'Order not found', status: 404 } });
    }

    // Check if user is order owner
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: { message: 'Not authorized', status: 403 } });
    }

    // Can only cancel pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({ error: { message: 'Cannot cancel this order', status: 400 } });
    }

    order.status = 'cancelled';
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};
