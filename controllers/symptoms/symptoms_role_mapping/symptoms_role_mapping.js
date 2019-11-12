const log = require('../../../config/components/log_config').logger('symptoms_controller');
const SymptomsRoleMapping = require(packageHelper.MODEL_CONFIG_DIR)['SymptomsRoleMapping'];

SymptomsRoleMapping.fetchSymptomsRoleMapping = (req, res) => {

  let whereObj = Object.assign({}, req.params, {
    include: [{
      model: models.Symptoms,
      as: 'symptom'
    }, {
      model: models.Roles,
      as: 'role'
    }]
  });
  models.SymptomsRoleMapping.findOne(whereObj)
    .then(fetch_res => {
      log.info('---SRM_FETCH_SUCCESS---');
      log.info(fetch_res);
      return res.send({
        success: true,
        message: 'Symptoms Role Mapping fetching success',
        data: {
          symptoms_role_mapping: fetch_res
        }
      });
    })
    .catch(fetch_err => {
      log.info('---SRM_FETCH_FAILURE---');
      log.info(fetch_err);
      return res.send({
        success: false,
        message: 'Symptoms Role Mapping fetching failure',
        data: {
          symptoms_role_mapping: fetch_err
        }
      });
    });
}

SymptomsRoleMapping.createSymptomsRoleMapping = (req, res) => {

  let createObj = Object.assign({}, req.body);
  models.SymptomsRoleMapping.create(createObj)
    .then(create_res => {
      log.info('---SRM_CREATION_SUCCESS---');
      log.info(create_res);
      return res.send({
        success: true,
        message: 'Symptoms Role Mapping creation success',
        data: {
          symptoms_role_mapping: create_res.toJSON()
        }
      });
    })
    .catch(create_err => {
      log.info('---SRM_CREATION_FAILURE---');
      log.info(create_err);
      return res.send({
        success: false,
        message: 'Symptoms Role Mapping creation failure',
        data: {
          symptoms_role_mapping: create_err
        }
      });
    });
}

module.exports = SymptomsRoleMapping;