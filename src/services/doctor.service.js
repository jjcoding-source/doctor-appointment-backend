const ApiError = require('../utils/ApiError');
const doctorRepo = require('../repositories/doctor.repo');
const appointmentRepo = require('../repositories/appointment.repo');
const Doctor = require('../models/doctor.model');
const Appointment = require('../models/appointment.model');
const mongoose = require('mongoose');


exports.getMyAppointments = async userId => {

  const doctor = await doctorRepo.findByUserId(userId);

  if (!doctor) {
    throw new ApiError(404, 'Doctor profile not found');
  }

  return appointmentRepo.findByDoctorId(doctor._id);
};


exports.approveAppointment = async ({ userId, appointmentId }) => {

  const doctor = await doctorRepo.findByUserId(userId);

  if (!doctor) {
    throw new ApiError(404, 'Doctor profile not found');
  }

  const appointment = await appointmentRepo.findById(appointmentId);

  if (!appointment) {
    throw new ApiError(404, 'Appointment not found');
  }

  if (appointment.doctorId.toString() !== doctor._id.toString()) {
    throw new ApiError(403, 'Not your appointment');
  }

  if (appointment.status !== 'BOOKED') {
    throw new ApiError(400, 'Only BOOKED appointments can be approved');
  }

  return appointmentRepo.updateStatus(appointmentId, 'APPROVED');
};


exports.cancelAppointment = async ({ userId, appointmentId }) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const doctor = await doctorRepo.findByUserId(userId);

    if (!doctor) {
      throw new ApiError(404, 'Doctor profile not found');
    }

    const appointment = await appointmentRepo.findById(appointmentId);

    if (!appointment) {
      throw new ApiError(404, 'Appointment not found');
    }

    if (appointment.doctorId.toString() !== doctor._id.toString()) {
      throw new ApiError(403, 'Not your appointment');
    }

    if (appointment.status === 'CANCELLED') {
      throw new ApiError(400, 'Already cancelled');
    }

    const slot = doctor.slots.find(
      s => s.start.getTime() === appointment.slotStart.getTime()
    );

    if (!slot) {
      throw new ApiError(500, 'Slot not found');
    }

    slot.isBooked = false;
    appointment.status = 'CANCELLED';

    await doctor.save({ session });
    await appointment.save({ session });

    await session.commitTransaction();
    session.endSession();

    return appointment;

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};


exports.getDailySummary = async ({ doctorUserId, date }) => {

  if (!date) {
    throw new ApiError(400, 'date is required');
  }

  const doctor = await Doctor.findOne({ userId: doctorUserId });

  if (!doctor) {
    throw new ApiError(404, 'Doctor profile not found');
  }

  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

 
  const slotsOfDay = doctor.slots.filter(s => {
    const t = new Date(s.start);
    return t >= dayStart && t <= dayEnd;
  });

  
  const appointments = await Appointment.find({
    doctorId: doctor._id,
    startTime: { $gte: dayStart, $lte: dayEnd }
  });

  const totalSlots = slotsOfDay.length;

  const bookedSlots = appointments.length;

  const approved = appointments.filter(a => a.status === 'APPROVED').length;
  const cancelled = appointments.filter(a => a.status === 'CANCELLED').length;
  const pending = appointments.filter(a => a.status === 'PENDING').length;

  const freeSlots = totalSlots - bookedSlots;

  return {
    date,
    totalSlots,
    bookedSlots,
    freeSlots,
    approved,
    cancelled,
    pending
  };
};


exports.getMonthlySummary = async ({ doctorUserId, month }) => {

  if (!month) {
    throw new ApiError(400, 'month is required (YYYY-MM)');
  }

  
  const [year, m] = month.split('-').map(Number);

  if (!year || !m || m < 1 || m > 12) {
    throw new ApiError(400, 'Invalid month format. Use YYYY-MM');
  }

  const doctor = await Doctor.findOne({ userId: doctorUserId });

  if (!doctor) {
    throw new ApiError(404, 'Doctor profile not found');
  }

  const monthStart = new Date(year, m - 1, 1, 0, 0, 0, 0);
  const monthEnd = new Date(year, m, 0, 23, 59, 59, 999);

 
  const slotsInMonth = doctor.slots.filter(s => {
    const t = new Date(s.start);
    return t >= monthStart && t <= monthEnd;
  });

  
  const appointments = await Appointment.find({
    doctorId: doctor._id,
    startTime: { $gte: monthStart, $lte: monthEnd }
  });

  
  const toKey = d =>
    new Date(d).toISOString().slice(0, 10);

  const slotMap = {};
  const appointmentMap = {};

 
  for (const s of slotsInMonth) {
    const key = toKey(s.start);
    slotMap[key] = (slotMap[key] || 0) + 1;
  }

 
  for (const a of appointments) {
    const key = toKey(a.startTime);
    appointmentMap[key] = (appointmentMap[key] || 0) + 1;
  }


  const allDays = new Set([
    ...Object.keys(slotMap),
    ...Object.keys(appointmentMap)
  ]);

  const result = [...allDays]
    .sort()
    .map(date => {

      const totalSlots = slotMap[date] || 0;
      const booked = appointmentMap[date] || 0;

      return {
        date,
        totalSlots,
        booked,
        free: totalSlots - booked
      };
    });

  return result;
};