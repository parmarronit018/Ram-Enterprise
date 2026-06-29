const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true },
  image:     { type: String }
});

const OrderSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:         { type: [OrderItemSchema], required: true },
  total:         { type: Number, required: true },
  address:       { type: String, required: true },
  phone:         { type: String, required: true },
  paymentMethod: { type: String, default: "COD" },
  status:        { type: String, default: "Confirmed", enum: ["Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"] }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);