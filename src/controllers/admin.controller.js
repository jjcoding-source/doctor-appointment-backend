const asyncHandler = require('../utils/asyncHandler');
const adminService = require('../services/admin.service');

exports.createDoctor = asyncHandler(async (req, res) => {
  const doctor = await adminService.createDoctorWithSlots(req.body);

  res.status(201).json(doctor);
});