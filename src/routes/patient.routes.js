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

module.exports = router;