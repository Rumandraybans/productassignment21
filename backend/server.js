require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { seedUsersAndProducts } = require('./controllers/authController');


const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(bodyParser.json());


app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);


mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected Smoothly via server.js');
    seedUsersAndProducts(); 
    
    app.listen(PORT, () => {
      console.log(`Backend MVC server is running safely on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  });