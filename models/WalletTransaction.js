const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['credit','debit'],
    required: true
  },
  source: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending','success','failed'],
    default: 'success'
  },
  rideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride'
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  balanceAfter: Number
}, { timestamps: true });

module.exports = mongoose.model('WalletTransaction', walletTransactionSchema);
