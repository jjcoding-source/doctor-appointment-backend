const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');

exports.register = asyncHandler(async (req, res) => {

  const result = await authService.register(req.body);

  res.status(201).json(result);
});


exports.login = asyncHandler(async (req, res) => {

  const result = await authService.login(req.body);

  res.json(result);
});