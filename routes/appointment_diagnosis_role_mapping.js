const express = packageHelper.express;
const router = express.Router();
const AppointmentDiagnosisRoleMapping = require('../controllers/appointments/appointment_diagnosis_role_mapping/appointment_diagnosis_role_mapping');

router.get('/fetchAppointmentDiagnosisRoleMapping', AppointmentDiagnosisRoleMapping.fetchAppointmentDiagnosisRoleMapping);
router.post('/createAppointmentDiagnosisRoleMapping', AppointmentDiagnosisRoleMapping.createAppointmentDiagnosisRoleMapping);

module.exports = router;