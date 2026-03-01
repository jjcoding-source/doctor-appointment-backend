const asyncHandler = require('../utils/asyncHandler');
const service = require('../services/appointment.service');

exports.book = asyncHandler(async (req, res) => {

  const result = await service.bookAppointment({
    doctorId: req.body.doctorId,
    patientId: req.user.id,
    slotStart: req.body.slotStart
  });

  res.status(201).json(result);
});