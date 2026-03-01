const Appointment = require('../models/appointment.model');

exports.create = data => Appointment.create(data);

exports.findByDoctorAndSlot = (doctorId, slotStart) =>
  Appointment.findOne({ doctorId, slotStart, status: { $ne: 'CANCELLED' } });

exports.findByDoctorId = doctorId =>
  Appointment.find({ doctorId })
    .populate('patientId', 'name email')
    .sort({ slotStart: 1 });

exports.findById = id => Appointment.findById(id);

exports.updateStatus = (id, status) =>
  Appointment.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  exports.findByPatientId = patientId =>
  Appointment.find({ patientId })
    .populate('doctorId')
    .sort({ slotStart: 1 });