const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

module.exports = (req, res, next) => {

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) throw new ApiError(401, 'No token');

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decoded;

  next();
};