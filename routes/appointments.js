const express = packageHelper.express;
const router = express.Router();
const Appointments = require('../controllers/appointments/appointments');

router.get('/appointmentDetails/:appointment_id', Appointments.appointmentDetails);
router.get('/statusBasedAppointments/:custom_from_date/:custom_to_date', Appointments.statusBasedAppointments);
router.post('/createAppointments', Appointments.createAppointment);
router.post('/appointmentFulfilment', Appointments.appointmentFulfilment);

module.exports = router;