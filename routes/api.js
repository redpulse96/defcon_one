const express = packageHelper.express;
const router = express.Router();

const DiagnosisRoleMapping = require('../controllers/diagnosis/diagnosis_role_mapping/diagnosis_role_mapping');
const ExaminationsRoleMapping = require('../controllers/examinations/examinations_role_mapping/examinations_role_mapping');
const InvestigationsRoleMapping = require('../controllers/investigations/investigations_role_mapping/investigations_role_mapping');
const SymptomsRoleMapping = require('../controllers/symptoms/symptoms_role_mapping/symptoms_role_mapping');

router.get('/DiagnosisRoleMapping/fetchDiagnosisRoleMapping', DiagnosisRoleMapping.fetchDiagnosisRoleMapping);
router.post('/DiagnosisRoleMapping/createDiagnosisRoleMapping', DiagnosisRoleMapping.createDiagnosisRoleMapping);

router.get('/ExaminationsRoleMapping/fetchExaminationsRoleMapping', ExaminationsRoleMapping.fetchExaminationsRoleMapping);
router.post('/ExaminationsRoleMapping/createExaminationsRoleMapping', ExaminationsRoleMapping.createExaminationsRoleMapping);

router.get('/InvestigationsRoleMapping/fetchInvestigationsRoleMapping', InvestigationsRoleMapping.fetchInvestigationsRoleMapping);
router.post('/InvestigationsRoleMapping/createInvestigationsRoleMapping', InvestigationsRoleMapping.createInvestigationsRoleMapping);

router.get('/SymptomsRoleMapping/fetchSymptomsRoleMapping', SymptomsRoleMapping.fetchSymptomsRoleMapping);
router.post('/SymptomsRoleMapping/createSymptomsRoleMapping', SymptomsRoleMapping.createSymptomsRoleMapping);

module.exports = router;
