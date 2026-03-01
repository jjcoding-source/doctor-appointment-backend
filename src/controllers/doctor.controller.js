const asyncHandler = require('../utils/asyncHandler');
const doctorService = require('../services/doctor.service');
const ApiResponse = require('../utils/ApiResponse');

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


exports.getDailySummary = asyncHandler(async (req, res) => {

  const result = await doctorService.getDailySummary({
    doctorUserId: req.user.id,
    date: req.query.date
  });

  res.json(
    new ApiResponse({
      message: 'Daily schedule summary',
      data: result
    })
  );
});


exports.getMonthlySummary = asyncHandler(async (req, res) => {

  const result = await doctorService.getMonthlySummary({
    doctorUserId: req.user.id,
    month: req.query.month
  });

  res.json(
    new ApiResponse({
      message: 'Monthly schedule summary',
      data: result
    })
  );
});