const Doctor = require('../models/doctor.model');

exports.create = data => Doctor.create(data);

exports.findByUserId = userId => Doctor.findOne({ userId });

exports.findById = id => Doctor.findById(id);