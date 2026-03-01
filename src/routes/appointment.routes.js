const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const allow = require('../middlewares/role.middleware');
const controller = require('../controllers/appointment.controller');

router.post(
  '/',
  auth,
  allow('PATIENT'),
  controller.book
);

module.exports = router;