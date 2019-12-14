const express = packageHelper.express;
const router = express.Router();
const ExaminationsRoleMapping = require('../controllers/examinations/examinations_role_mapping/examinations_role_mapping');

router.get('/fetchExaminationsRoleMapping', ExaminationsRoleMapping.fetchExaminationsRoleMapping);
router.post('/createExaminationsRoleMapping', ExaminationsRoleMapping.createExaminationsRoleMapping);

module.exports = router;