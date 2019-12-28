const express = packageHelper.express;
const router = express.Router();
const InvestigationsRoleMapping = require('../controllers/investigations/investigations_role_mapping/investigations_role_mapping');

router.get('/fetchInvestigationsRoleMapping', InvestigationsRoleMapping.fetchInvestigationsRoleMapping);
router.post('/createInvestigationsRoleMapping', InvestigationsRoleMapping.createInvestigationsRoleMapping);

module.exports = router;