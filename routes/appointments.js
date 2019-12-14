const express = packageHelper.express;
const router = express.Router();
const Appointments = require('../controllers/appointments/appointments');

router.get('/statusBasedAppointments/:user_id/:custom_date', Appointments.statusBasedAppointments);
router.post('/createAppointments', Appointments.createAppointment);
router.get('/appointmentDetails/:appointment_id', Appointments.appointmentDetails);
router.post('/appointmentFulfilment', Appointments.appointmentFulfilment);

module.exports = router;