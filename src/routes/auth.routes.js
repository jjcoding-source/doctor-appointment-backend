const router = require('express').Router();

const controller = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');

router.post(
  '/register',
  validate.validateRegister,
  controller.register
);

router.post(
  '/login',
  validate.validateLogin,
  controller.login
);

module.exports = router;