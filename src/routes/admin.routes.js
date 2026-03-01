const router = require('express').Router();

const controller = require('../controllers/admin.controller');
const auth = require('../middlewares/auth.middleware');
const allow = require('../middlewares/role.middleware');

router.post(
  '/doctors',
  auth,
  allow('ADMIN'),
  controller.createDoctor
);

router.patch(
  '/doctors/:id/status',
  auth,
  allow('ADMIN'),
  controller.setDoctorStatus
);

module.exports = router;