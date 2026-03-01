const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const userRepo = require('../repositories/user.repo');

exports.register = async ({ name, email, password, role }) => {

  const existing = await userRepo.findByEmail(email);

  if (existing) {
    throw new ApiError(409, 'Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepo.create({
    name,
    email,
    password: hashedPassword,
    role
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};


exports.login = async ({ email, password }) => {

  const user = await userRepo.findByEmail(email);

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h'
    }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};