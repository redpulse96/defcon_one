const express = packageHelper.express;
const router = express.Router();
const AppointmentSymptomsRoleMapping = require('../controllers/appointments/appointment_symptoms_role_mapping/appointment_symptoms_role_mapping');

router.get('/fetchAppointmentSymptomsRoleMapping', AppointmentSymptomsRoleMapping.fetchAppointmentSymptomsRoleMapping);
router.post('/createAppointmentSymptomsRoleMapping', AppointmentSymptomsRoleMapping.createAppointmentSymptomsRoleMapping);

module.exports = router;