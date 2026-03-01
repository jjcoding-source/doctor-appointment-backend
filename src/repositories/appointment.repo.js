const Appointment = require('../models/appointment.model');

exports.create = data => Appointment.create(data);

exports.findByDoctorAndSlot = (doctorId, slotStart) =>
  Appointment.findOne({ doctorId, slotStart, status: 'BOOKED' });