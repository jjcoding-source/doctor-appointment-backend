const ApiError = require('../utils/ApiError');
const userRepo = require('../repositories/user.repo');
const doctorRepo = require('../repositories/doctor.repo');


function generateSlots({
  startDate,
  endDate,
  dayStartTime,
  dayEndTime,
  slotDurationMinutes
}) {
  const slots = [];

  const start = new Date(startDate);
  const end = new Date(endDate);

  for (
    let date = new Date(start);
    date <= end;
    date.setDate(date.getDate() + 1)
  ) {
    const [startHour, startMin] = dayStartTime.split(':').map(Number);
    const [endHour, endMin] = dayEndTime.split(':').map(Number);

    let current = new Date(date);
    current.setHours(startHour, startMin, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(endHour, endMin, 0, 0);

    while (current < dayEnd) {
      const slotStart = new Date(current);
      const slotEnd = new Date(
        current.getTime() + slotDurationMinutes * 60000
      );

      if (slotEnd <= dayEnd) {
        slots.push({
          start: slotStart,
          end: slotEnd,
          isBooked: false
        });
      }

      current = slotEnd;
    }
  }

  return slots;
}

exports.createDoctorWithSlots = async payload => {
  const {
    userId,
    specialization,
    startDate,
    endDate,
    dayStartTime,
    dayEndTime,
    slotDurationMinutes
  } = payload;

  const user = await userRepo.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.role !== 'DOCTOR') {
    throw new ApiError(400, 'User role must be DOCTOR');
  }

  const alreadyDoctor = await doctorRepo.findByUserId(userId);

  if (alreadyDoctor) {
    throw new ApiError(409, 'Doctor profile already exists');
  }

  const slots = generateSlots({
    startDate,
    endDate,
    dayStartTime,
    dayEndTime,
    slotDurationMinutes
  });

  if (!slots.length) {
    throw new ApiError(400, 'No slots generated with given input');
  }

  return doctorRepo.create({
    userId,
    specialization,
    slots
  });
};


exports.setDoctorStatus = async ({ doctorId, isActive }) => {

  const doctor = await doctorRepo.findById(doctorId);

  if (!doctor) {
    throw new ApiError(404, 'Doctor not found');
  }

  doctor.isActive = isActive;
  await doctor.save();

  return doctor;
};