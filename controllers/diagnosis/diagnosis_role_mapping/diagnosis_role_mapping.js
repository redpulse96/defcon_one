const log = require('../../../config/components/log_config').logger('diagnosis_role_mapping_controller');
const DiagnosisRoleMapping = require(packageHelper.MODEL_CONFIG_DIR)['DiagnosisRoleMapping'];

DiagnosisRoleMapping.fetchDiagnosisRoleMapping = (req, res) => {

  let whereObj = Object.assign({}, req.params, {
    include: [{
      model: models.DiagnosisRoleMapping,
      as: 'diagnosis_role_mapping'
    }, {
      model: models.Roles,
      as: 'role'
    }]
  });
  models.DiagnosisRoleMapping.findOne(whereObj)
    .then(fetch_res => {
      log.info('---PATIENT_PRESCRIPTION_FETCH_SUCCESS---');
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
      log.info('---PATIENT_PRESCRIPTION_FETCH_FAILURE---');
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
      log.info('---PATIENT_PRESCRIPTION_CREATION_SUCCESS---');
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
      log.info('---PATIENT_PRESCRIPTION_CREATION_FAILURE---');
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