const doctorRepo = require('../repositories/doctor.repo');

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