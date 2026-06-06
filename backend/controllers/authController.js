const User = require('../models/User');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      res.status(200).json({
        message: 'Login successful',
        token: token,       
        role: user.role,
        email: user.email
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

const seedUsersAndProducts = async () => {
  try {
    if ((await User.countDocuments()) === 0) {
      const initialUsers = [
        { email: 'admin1@art.com', password: 'adminpassword', role: 'admin' },
        { email: 'admin2@art.com', password: 'adminpassword', role: 'admin' },
        { email: 'customer1@gmail.com', password: 'custpassword', role: 'customer' },
        { email: 'customer2@gmail.com', password: 'custpassword', role: 'customer' }
      ];
      for (let userData of initialUsers) {
        const user = new User(userData);
        await user.save(); 
      }
      console.log('Default users password hashed.');
    }

    if ((await Product.countDocuments()) === 0) {
      await Product.insertMany([
        { name: 'A3 size Drawing Book', price: 15.99, description: 'Drawing book for artists.', stock: 100 },
        { name: 'Crayon Set', price: 70, description: '120 GSM pages perfect for sketching.', stock: 50 },
        { name: 'Fountain Pen', price: 160, description: 'Glamorous pen for pretty writing.', stock: 10 }
      ]);
      console.log('Products added.');
    }
  } catch (error) {
    console.error('Error database:', error);
  }
};

module.exports = { loginUser, seedUsersAndProducts };