const express = packageHelper.express;
const router = express.Router();
const PatientExaminationsRoleMapping = require('../controllers/patients/patient_examinations_role_mapping/patient_examinations_role_mapping');

router.get('/fetchPatientExaminationsRoleMapping', PatientExaminationsRoleMapping.fetchPatientExaminationsRoleMapping);
router.post('/createPatientExaminationsRoleMapping', PatientExaminationsRoleMapping.createPatientExaminationsRoleMapping);

module.exports = router;