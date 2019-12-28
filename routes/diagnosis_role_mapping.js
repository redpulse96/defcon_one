const express = packageHelper.express;
const router = express.Router();
const DiagnosisRoleMapping = require('../controllers/diagnosis/diagnosis_role_mapping/diagnosis_role_mapping');

router.get('/fetchDiagnosisRoleMapping', DiagnosisRoleMapping.fetchDiagnosisRoleMapping);
router.post('/createDiagnosisRoleMapping', DiagnosisRoleMapping.createDiagnosisRoleMapping);

module.exports = router;