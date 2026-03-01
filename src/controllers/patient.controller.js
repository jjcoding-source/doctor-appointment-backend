const asyncHandler = require('../utils/asyncHandler');
const patientService = require('../services/patient.service');

exports.getDoctors = asyncHandler(async (req, res) => {

  const result = await patientService.getDoctorsWithAvailableSlots({
    page: req.query.page,
    limit: req.query.limit
  });

  res.json(result);
});


exports.getMyAppointments = asyncHandler(async (req, res) => {

  const result = await patientService.getMyAppointments(req.user.id);

  res.json(result);
});


exports.cancelMyAppointment = asyncHandler(async (req, res) => {

  const result = await patientService.cancelMyAppointment({
    userId: req.user.id,
    appointmentId: req.params.id
  });

  res.json(result);
});