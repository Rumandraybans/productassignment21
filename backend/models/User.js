const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // 1. Change this line to bcryptjs

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'customer'] }
});


userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  try {
    
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    throw error;
  }
});

module.exports = mongoose.model('User', userSchema);