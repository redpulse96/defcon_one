const express = packageHelper.express;
const router = express.Router();
const PatientInvestigationsRoleMapping = require('../controllers/patients/patient_investigations_role_mapping/patient_investigations_role_mapping');

router.get('/fetchPatientInvestigationsRoleMapping', PatientInvestigationsRoleMapping.fetchPatientInvestigationsRoleMapping);
router.post('/createPatientInvestigationsRoleMapping', PatientInvestigationsRoleMapping.createPatientInvestigationsRoleMapping);

module.exports = router;