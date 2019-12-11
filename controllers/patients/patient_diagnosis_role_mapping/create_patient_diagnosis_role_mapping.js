const log = require('../../../config/log_config').logger('patient_diagnosis_role_mappings_controller');
const utils = require('../../utility/utils');
const async = packageHelper.async;

module.exports = PatientDiagnosisRoleMapping => {

  PatientDiagnosisRoleMapping.createPatientDiagnosisRoleMapping = (req, res) => {
    async.auto({
      validateData: validateDataFunction,
      createPatientDiagnosisRoleMapping: ['validateData', createPatientDiagnosisRoleMappingFunction]
    })
      .then(async_auto_res => res.send(async_auto_res))
      .catch(async_auto_err => res.status(async_auto_err.error_code).send(async_auto_err));

    function validateDataFunction(callback) {
      let paramsCheck = {
        data: req.body,
        mandatoryParams: 'patientDiagnosisRoleMappings'
      }
      utils.hasMandatoryParams(paramsCheck)
        .then(param_res => callback(null, param_res))
        .catch(param_err => callback(param_err));
    }

    function createPatientDiagnosisRoleMappingFunction(results, callback) {
      let createArray = req.body.patientDiagnosisRoleMappings;
      models['PatientDiagnosisRoleMapping'].bulkCreate(createArray, { returning: true })
        .then(create_res => {
          log.info('---PATIENT_PRESCRIPTION_CREATION_SUCCESS---');
          log.info(create_res);
          return callback(null, {
            success: true,
            message: 'Patient Diagnosis Role Mapping creation success',
            data: {
              patient_diagnosis_role_mapping: create_res
            }
          });
        })
        .catch(create_err => {
          log.error('---PATIENT_PRESCRIPTION_CREATION_FAILURE---');
          log.error(create_err);
          return callback({
            success: false,
            message: 'Patient Diagnosis Role Mapping creation failure',
            data: {}
          });
        });
    }
  }
}