const log = require('../config/components/log_config').logger('api_routes');
const express = require('express');
const router = express.Router();

const models = require('../config/components/index');

/* GET users listing. */
router.get('/Roles/getRoles', (req, res, next) => {
  models.Roles.findAll({
      include: [{
        model: models.SymptomsRoleMapping,
        as: 'symptoms_role_mapping'
      }]
    })
    .then(roles_map => {
      log.info('---ExaminationRoleMapping---');
      log.info(roles_map);
      res.status(200).send({
        success: true,
        msg: 'roles successfully fetched',
        data: roles_map
      })
    })
    .catch(err => {
      log.info('---ERROR---');
      log.info(err);
      next(err);
    })
});
// router.get('/Patients/getPatients', getPatients);

module.exports = router;
