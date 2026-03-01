const Doctor = require('../models/doctor.model');

exports.create = data => Doctor.create(data);

exports.findByUserId = userId => Doctor.findOne({ userId });

exports.findById = id => Doctor.findById(id);

exports.findActiveDoctors = async ({ skip, limit }) => {
  return Doctor.find({ isActive: true })
    .populate('userId', 'name email')
    .skip(skip)
    .limit(limit);
};

exports.countActiveDoctors = () =>
  Doctor.countDocuments({ isActive: true });