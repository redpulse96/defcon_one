const log = require('../../../config/log_config').logger('diagnosis_role_mapping_controller');
const DiagnosisRoleMapping = require(packageHelper.MODEL_CONFIG_DIR)['DiagnosisRoleMapping'];

DiagnosisRoleMapping.fetchDiagnosisRoleMapping = (req, res) => {

  let whereObj = Object.assign({}, req.params, {
    where: {
      role_id: req.user.role_id
    },
    include: [{
      model: models['Diagnosis'],
      as: 'diagnosis'
    }, {
      model: models['Roles'],
      as: 'role'
    }]
  });
  models['DiagnosisRoleMapping'].scope('activeScope').findAll(whereObj)
    .then(fetch_res => {
      log.info('---DiagnosisRoleMapping_FETCH_SUCCESS---');
      log.info(fetch_res);
      return res.send({
        success: true,
        message: 'diagnosis Role Mapping fetching success',
        data: {
          diagnosis_role_mapping: fetch_res
        }
      });
    })
    .catch(fetch_err => {
      log.info('---DiagnosisRoleMapping_FETCH_FAILURE---');
      log.info(fetch_err);
      return res.send({
        success: false,
        message: 'diagnosis Role Mapping fetching failure',
        data: {
          diagnosis_role_mapping: fetch_err
        }
      });
    });
}

DiagnosisRoleMapping.createDiagnosisRoleMapping = (req, res) => {

  let createObj = Object.assign({}, req.body);
  models.DiagnosisRoleMapping.create(createObj)
    .then(create_res => {
      log.info('---DiagnosisRoleMapping_CREATION_SUCCESS---');
      log.info(create_res);
      return res.send({
        success: true,
        message: 'diagnosis Role Mapping creation success',
        data: {
          diagnosis_role_mapping: create_res.toJSON()
        }
      });
    })
    .catch(create_err => {
      log.info('---DiagnosisRoleMapping_CREATION_FAILURE---');
      log.info(create_err);
      return res.send({
        success: false,
        message: 'diagnosis Role Mapping creation failure',
        data: {
          diagnosis_role_mapping: create_err
        }
      });
    });
}

module.exports = DiagnosisRoleMapping;