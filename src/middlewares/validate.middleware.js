const ApiError = require('../utils/ApiError');

exports.validateRegister = (req, res, next) => {

  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    throw new ApiError(400, 'All fields are required');
  }

  next();
};

exports.validateLogin = (req, res, next) => {

  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  next();
};