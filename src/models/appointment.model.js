const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  slotStart: Date,
  slotEnd: Date,
  status: {
    type: String,
    enum: ['BOOKED', 'APPROVED', 'CANCELLED'],
    default: 'BOOKED'
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);