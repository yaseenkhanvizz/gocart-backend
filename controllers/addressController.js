const Address = require('../models/Address');

// @desc    Get all user addresses
// @route   GET /api/addresses
// @access  Private
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Get single address
// @route   GET /api/addresses/:id
// @access  Private
exports.getAddressById = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });

    if (address) {
      res.json(address);
    } else {
      res.status(404).json({ error: { message: 'Address not found', status: 404 } });
    }
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Create new address
// @route   POST /api/addresses
// @access  Private
exports.createAddress = async (req, res) => {
  try {
    const address = await Address.create({
      ...req.body,
      user: req.user._id
    });

    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
exports.updateAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });

    if (address) {
      Object.assign(address, req.body);
      const updatedAddress = await address.save();
      res.json(updatedAddress);
    } else {
      res.status(404).json({ error: { message: 'Address not found', status: 404 } });
    }
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });

    if (address) {
      await address.deleteOne();
      res.json({ message: 'Address removed' });
    } else {
      res.status(404).json({ error: { message: 'Address not found', status: 404 } });
    }
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Set default address
// @route   PATCH /api/addresses/:id/default
// @access  Private
exports.setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });

    if (address) {
      // Set all other addresses to non-default
      await Address.updateMany(
        { user: req.user._id, _id: { $ne: req.params.id } },
        { isDefault: false }
      );

      address.isDefault = true;
      const updatedAddress = await address.save();
      res.json(updatedAddress);
    } else {
      res.status(404).json({ error: { message: 'Address not found', status: 404 } });
    }
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};
