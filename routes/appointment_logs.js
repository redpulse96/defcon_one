const express = packageHelper.express;
const router = express.Router();
const AppointmentLogs = require('../controllers/appointments/appointment_logs/appointment_logs');

router.get('/AppointmentLogs/fetchAppointmentLogs', AppointmentLogs.fetchAppointmentLogs);

module.exports = router;