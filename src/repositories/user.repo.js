const User = require('../models/user.model');

exports.create = data => User.create(data);

exports.findByEmail = email =>
  User.findOne({ email }).select('+password');

exports.findById = id => User.findById(id);