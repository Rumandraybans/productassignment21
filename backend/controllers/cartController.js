const Cart = require('../models/Cart');
const jwt = require('jsonwebtoken');

const getEmailFromToken = (req) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.email; // Grabs the user email string out of the verified JWT token
  } catch (err) {
    return null;
  }
};

const getCart = async (req, res) => {
  const customerEmail = getEmailFromToken(req);
  if (!customerEmail) return res.status(401).json({ message: 'Unauthorized: Invalid token' });

  try {
    // Search using the exact schema key "customerEmail"
    let cart = await Cart.findOne({ customerEmail });
    if (!cart) {
      cart = new Cart({ customerEmail, items: [] });
      await cart.save();
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

const addToCart = async (req, res) => {
  const customerEmail = getEmailFromToken(req);
  if (!customerEmail) return res.status(401).json({ message: 'Unauthorized: Invalid token' });

  const { productId, name, price } = req.body;

  try {
    let cart = await Cart.findOne({ customerEmail });
    if (!cart) {
      cart = new Cart({ customerEmail, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({ productId, name, price, quantity: 1 });
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart successfully', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart', error: error.message });
  }
};

module.exports = { getCart, addToCart };