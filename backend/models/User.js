const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: [true, "Naam zaroori hai"] },
  email:    { type: String, required: [true, "Email chahiye"], unique: true, lowercase: true, trim: true },
  password: { type: String, required: [true, "Password dena padega"] },
  phone:    { type: String, default: "" },
  isAdmin:  { type: Boolean, default: false }
}, { timestamps: true });

// Password hash karo save se pehle
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password compare karne ke liye method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);