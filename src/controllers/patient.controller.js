const asyncHandler = require('../utils/asyncHandler');
const patientService = require('../services/patient.service');

exports.getDoctors = asyncHandler(async (req, res) => {

  const result = await patientService.getDoctorsWithAvailableSlots({
    page: req.query.page,
    limit: req.query.limit
  });

  res.json(result);
});