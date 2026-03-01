const router = require('express').Router();

const controller = require('../controllers/patient.controller');
const auth = require('../middlewares/auth.middleware');
const allow = require('../middlewares/role.middleware');

router.get(
  '/doctors',
  auth,
  allow('PATIENT'),
  controller.getDoctors
);

router.get(
  '/appointments',
  auth,
  allow('PATIENT'),
  controller.getMyAppointments
);

router.patch(
  '/appointments/:id/cancel',
  auth,
  allow('PATIENT'),
  controller.cancelMyAppointment
);

module.exports = router;