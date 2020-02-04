const log = require('../../../config/log_config').logger('diagnosis_role_mapping_controller');
const DiagnosisRoleMapping = require(packageHelper.MODEL_CONFIG_DIR)['DiagnosisRoleMapping'];

DiagnosisRoleMapping.fetchDiagnosisRoleMapping = (req, res) => {
  let where_Obj = {
    where: {
      ...req.params,
      role_id: req.user.role_id
    },
    include: [{
      model: models['Diagnosis'],
      as: 'diagnosis'
    }, {
      model: models['Roles'],
      as: 'role'
    }]
  };
  models['DiagnosisRoleMapping']
    .scope('activeScope').findAll(where_Obj)
    .then(fetchRes => {
      log.info('---DiagnosisRoleMapping_FETCH_SUCCESS---');
      log.info(fetchRes);
      return res.send({
        success: true,
        message: 'diagnosis Role Mapping fetching success',
        data: {
          diagnosis_role_mapping: fetchRes
        }
      });
    })
    .catch(fetchErr => {
      log.info('---DiagnosisRoleMapping_FETCH_FAILURE---');
      log.info(fetchErr);
      return res.send({
        success: false,
        message: 'diagnosis Role Mapping fetching failure',
        data: {}
      });
    });
}

DiagnosisRoleMapping.createDiagnosisRoleMapping = (req, res) => {
  let create_Obj = {
    ...req.body
  };
  models.DiagnosisRoleMapping.create(create_Obj)
    .then(createRes => {
      log.info('---DiagnosisRoleMapping_CREATION_SUCCESS---');
      log.info(createRes);
      return res.send({
        success: true,
        message: 'diagnosis Role Mapping creation success',
        data: {
          diagnosis_role_mapping: createRes.toJSON()
        }
      });
    })
    .catch(createErr => {
      log.info('---DiagnosisRoleMapping_CREATION_FAILURE---');
      log.info(createErr);
      return res.send({
        success: false,
        message: 'diagnosis Role Mapping creation failure',
        data: {}
      });
    });
}

module.exports = DiagnosisRoleMapping;