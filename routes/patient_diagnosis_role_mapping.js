const express = packageHelper.express;
const router = express.Router();
const PatientDiagnosisRoleMapping = require('../controllers/patients/patient_diagnosis_role_mapping/patient_diagnosis_role_mapping');

router.get('/fetchPatientDiagnosisRoleMapping', PatientDiagnosisRoleMapping.fetchPatientDiagnosisRoleMapping);
router.post('/createPatientDiagnosisRoleMapping', PatientDiagnosisRoleMapping.createPatientDiagnosisRoleMapping);

module.exports = router;