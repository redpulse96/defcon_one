const log = require('../../../config/log_config').logger('examinations_role_mapping_controller');
const ExaminationsRoleMapping = require(packageHelper.MODEL_CONFIG_DIR)['ExaminationsRoleMapping'];

ExaminationsRoleMapping.fetchExaminationsRoleMapping = (req, res) => {
  let whereObj = {
    where: {
      ...req.params,
      role_id: req.user.role_id
    },
    include: [{
      model: models['Examinations'],
      as: 'examination'
    }, {
      model: models['Roles'],
      as: 'role'
    }]
  };
  models['ExaminationsRoleMapping']
    .scope('activeScope').findAll(whereObj)
    .then(fetchRes => {
      log.info('---ExaminationsRoleMapping_FETCH_SUCCESS---');
      log.info(fetchRes);
      return res.send({
        success: true,
        message: 'examinations Role Mapping fetching success',
        data: {
          examinations_role_mapping: fetchRes
        }
      });
    })
    .catch(fetchErr => {
      log.info('---ExaminationsRoleMapping_FETCH_FAILURE---');
      log.info(fetchErr);
      return res.status(500).send({
        success: false,
        message: 'examinations Role Mapping fetching failure',
        data: {}
      });
    });
}

ExaminationsRoleMapping.createExaminationsRoleMapping = (req, res) => {
  let createObj = {
    ...req.body
  };
  models.ExaminationsRoleMapping.create(createObj)
    .then(createRes => {
      log.info('---ExaminationsRoleMapping_CREATION_SUCCESS---');
      log.info(createRes);
      return res.send({
        success: true,
        message: 'examinations Role Mapping creation success',
        data: {
          examinations_role_mapping: createRes.toJSON()
        }
      });
    })
    .catch(createErr => {
      log.info('---ExaminationsRoleMapping_CREATION_FAILURE---');
      log.info(createErr);
      return res.send({
        success: false,
        message: 'examinations Role Mapping creation failure',
        data: {}
      });
    });
}

module.exports = ExaminationsRoleMapping;