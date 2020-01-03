const express = packageHelper.express;
const router = express.Router();
const AppointmentInvestigationsRoleMapping = require('../controllers/appointments/appointment_investigations_role_mapping/appointment_investigations_role_mapping');

router.get('/fetchAppointmentInvestigationsRoleMapping', AppointmentInvestigationsRoleMapping.fetchAppointmentInvestigationsRoleMapping);
router.post('/createAppointmentInvestigationsRoleMapping', AppointmentInvestigationsRoleMapping.createAppointmentInvestigationsRoleMapping);

module.exports = router;