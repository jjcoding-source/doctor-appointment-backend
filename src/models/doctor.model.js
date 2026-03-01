const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  specialization: String,
  slots: [
    {
      start: Date,
      end: Date,
      isBooked: { type: Boolean, default: false }
    }
  ],
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Doctor', doctorSchema);