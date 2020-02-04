const log = require('../../../config/log_config').logger('symptoms_controller');
const SymptomsRoleMapping = require(packageHelper.MODEL_CONFIG_DIR)['SymptomsRoleMapping'];

SymptomsRoleMapping.fetchSymptomsRoleMapping = (req, res) => {
  let where_Obj = {
    where: {
      ...req.params,
      role_id: req.user.role_id
    },
    include: [{
      model: models['Symptoms'],
      as: 'symptom'
    }, {
      model: models['Roles'],
      as: 'role'
    }]
  };
  models['SymptomsRoleMapping']
    .scope('activeScope').findAll(where_Obj)
    .then(fetchRes => {
      log.info('---SRM_FETCH_SUCCESS---');
      log.info(fetchRes);
      return res.send({
        success: true,
        message: 'Symptoms Role Mapping fetching success',
        data: {
          symptoms_role_mapping: fetchRes
        }
      });
    })
    .catch(fetchErr => {
      log.info('---SRM_FETCH_FAILURE---');
      log.info(fetchErr);
      return res.status(500).send({
        success: false,
        message: 'Symptoms Role Mapping fetching failure',
        data: {}
      });
    });
}

SymptomsRoleMapping.createSymptomsRoleMapping = (req, res) => {
  let create_Obj = {
    ...req.body
  };
  models.SymptomsRoleMapping.create(create_Obj)
    .then(createRes => {
      log.info('---SRM_CREATION_SUCCESS---');
      log.info(createRes);
      return res.send({
        success: true,
        message: 'Symptoms Role Mapping creation success',
        data: {
          symptoms_role_mapping: createRes.toJSON()
        }
      });
    })
    .catch(createErr => {
      log.info('---SRM_CREATION_FAILURE---');
      log.info(createErr);
      return res.send({
        success: false,
        message: 'Symptoms Role Mapping creation failure',
        data: {}
      });
    });
}

module.exports = SymptomsRoleMapping;