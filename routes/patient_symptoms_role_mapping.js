const express = packageHelper.express;
const router = express.Router();
const PatientSymptomsRoleMapping = require('../controllers/patients/patient_symptoms_role_mapping/patient_symptoms_role_mapping');

router.get('/fetchPatientSymptomsRoleMapping', PatientSymptomsRoleMapping.fetchPatientSymptomsRoleMapping);
router.post('/createPatientSymptomsRoleMapping', PatientSymptomsRoleMapping.createPatientSymptomsRoleMapping);

module.exports = router;