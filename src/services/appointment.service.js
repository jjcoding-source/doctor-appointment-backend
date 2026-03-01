const ApiError = require('../utils/ApiError');
const Doctor = require('../models/doctor.model');
const appointmentRepo = require('../repositories/appointment.repo');

exports.bookAppointment = async ({ doctorId, patientId, slotStart }) => {

  const doctor = await Doctor.findById(doctorId);

  if (!doctor || !doctor.isActive) {
    throw new ApiError(404, 'Doctor not available');
  }

  const slot = doctor.slots.find(
    s => s.start.getTime() === new Date(slotStart).getTime()
  );

  if (!slot) {
    throw new ApiError(400, 'Invalid slot');
  }

  if (slot.isBooked) {
    throw new ApiError(409, 'Slot already booked');
  }

  const existing =
    await appointmentRepo.findByDoctorAndSlot(doctorId, slot.start);

  if (existing) {
    throw new ApiError(409, 'Slot already booked');
  }

  slot.isBooked = true;
  await doctor.save();

  return appointmentRepo.create({
    doctorId,
    patientId,
    slotStart: slot.start,
    slotEnd: slot.end
  });
};