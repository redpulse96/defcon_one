const express = packageHelper.express;
const router = express.Router();
const SymptomsRoleMapping = require('../controllers/symptoms/symptoms_role_mapping/symptoms_role_mapping');

router.get('/fetchSymptomsRoleMapping', SymptomsRoleMapping.fetchSymptomsRoleMapping);
router.post('/createSymptomsRoleMapping', SymptomsRoleMapping.createSymptomsRoleMapping);

module.exports = router;