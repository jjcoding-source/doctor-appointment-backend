const ApiError = require('../utils/ApiError');
const appointmentRepo = require('../repositories/appointment.repo');
const doctorRepo = require('../repositories/doctor.repo');
const mongoose = require('mongoose');

exports.getDoctorsWithAvailableSlots = async ({ page = 1, limit = 10 }) => {

  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const [doctors, total] = await Promise.all([
    doctorRepo.findActiveDoctors({ skip, limit }),
    doctorRepo.countActiveDoctors()
  ]);

  const result = doctors.map(d => {

    const availableSlots = d.slots
      .filter(s => !s.isBooked)
      .map(s => ({
        start: s.start,
        end: s.end
      }));

    return {
      id: d._id,
      doctorName: d.userId?.name,
      email: d.userId?.email,
      specialization: d.specialization,
      slots: availableSlots
    };
  });

  return {
    data: result,
    page,
    limit,
    total
  };
};

exports.getMyAppointments = async userId => {
  return appointmentRepo.findByPatientId(userId);
};

exports.cancelMyAppointment = async ({ userId, appointmentId }) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const appointment = await appointmentRepo.findById(appointmentId);

    if (!appointment) {
      throw new ApiError(404, 'Appointment not found');
    }

    if (appointment.patientId.toString() !== userId) {
      throw new ApiError(403, 'Not your appointment');
    }

    if (appointment.status === 'CANCELLED') {
      throw new ApiError(400, 'Appointment already cancelled');
    }

    const doctor = await doctorRepo.findById(appointment.doctorId);

    if (!doctor) {
      throw new ApiError(404, 'Doctor not found');
    }


    const slot = doctor.slots.find(
      s => s.start.getTime() === appointment.slotStart.getTime()
    );

    if (!slot) {
      throw new ApiError(500, 'Slot not found in doctor profile');
    }

    slot.isBooked = false;

    appointment.status = 'CANCELLED';

    await appointment.save({ session });
    await doctor.save({ session });

    await session.commitTransaction();
    session.endSession();

    return appointment;

  } catch (err) {

    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
