const asyncHandler = require('../utils/asyncHandler');
const adminService = require('../services/admin.service');

exports.createDoctor = asyncHandler(async (req, res) => {
  const doctor = await adminService.createDoctorWithSlots(req.body);

  res.status(201).json(doctor);
});

exports.setDoctorStatus = asyncHandler(async (req, res) => {

  const result = await adminService.setDoctorStatus({
    doctorId: req.params.id,
    isActive: req.body.isActive
  });

  res.json(result);
});

