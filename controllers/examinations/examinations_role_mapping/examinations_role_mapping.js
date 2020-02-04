const log = require('../../../config/log_config').logger('examinations_role_mapping_controller');
const ExaminationsRoleMapping = require(packageHelper.MODEL_CONFIG_DIR)['ExaminationsRoleMapping'];

ExaminationsRoleMapping.fetchExaminationsRoleMapping = (req, res) => {
  let where_Obj = {
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
    .scope('activeScope').findAll(where_Obj)
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
      // return utils.generateResponse(ERM_FETCH_ERROR)(res);
      return res.status(500).send({
        success: false,
        message: 'examinations Role Mapping fetching failure',
        data: {}
      });
    });
}

ExaminationsRoleMapping.createExaminationsRoleMapping = (req, res) => {
  let create_Obj = {
    ...req.body
  };
  models.ExaminationsRoleMapping.create(create_Obj)
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
      // return utils.generateResponse(ERM_CREATE_ERROR)(res);
      return res.send({
        success: false,
        message: 'examinations Role Mapping creation failure',
        data: {}
      });
    });
}

module.exports = ExaminationsRoleMapping;