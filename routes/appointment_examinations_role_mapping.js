const express = packageHelper.express;
const router = express.Router();
const AppointmentExaminationsRoleMapping = require('../controllers/appointments/appointment_examinations_role_mapping/appointment_examinations_role_mapping');

router.get('/fetchAppointmentExaminationsRoleMapping', AppointmentExaminationsRoleMapping.fetchAppointmentExaminationsRoleMapping);
router.post('/createAppointmentExaminationsRoleMapping', AppointmentExaminationsRoleMapping.createAppointmentExaminationsRoleMapping);

module.exports = router;