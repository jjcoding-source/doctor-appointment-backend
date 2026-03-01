const router = require('express').Router();

const controller = require('../controllers/doctor.controller');
const auth = require('../middlewares/auth.middleware');
const allow = require('../middlewares/role.middleware');

router.get(
  '/appointments',
  auth,
  allow('DOCTOR'),
  controller.getMyAppointments
);

router.get(
  '/schedule/summary',
  auth,
  allow('DOCTOR'),
  controller.getDailySummary
);

router.get(
  '/schedule/month',
  auth,
  allow('DOCTOR'),
  controller.getMonthlySummary
);

router.patch(
  '/appointments/:id/approve',
  auth,
  allow('DOCTOR'),
  controller.approveAppointment
);

router.patch(
  '/appointments/:id/cancel',
  auth,
  allow('DOCTOR'),
  controller.cancelAppointment
);

module.exports = router;