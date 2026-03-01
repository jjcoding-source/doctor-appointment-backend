const asyncHandler = require('../utils/asyncHandler');
const doctorService = require('../services/doctor.service');

exports.getMyAppointments = asyncHandler(async (req, res) => {

  const result = await doctorService.getMyAppointments(req.user.id);

  res.json(result);
});


exports.approveAppointment = asyncHandler(async (req, res) => {

  const result = await doctorService.approveAppointment({
    userId: req.user.id,
    appointmentId: req.params.id
  });

  res.json(result);
});


exports.cancelAppointment = asyncHandler(async (req, res) => {

  const result = await doctorService.cancelAppointment({
    userId: req.user.id,
    appointmentId: req.params.id
  });

  res.json(result);
});