const log = require('../../../config/log_config').logger('patient_investigations_role_mappings_controller');
const utils = require('../../utility/utils');
const async = packageHelper.async;

module.exports = PatientInvestigationsRoleMapping => {

  PatientInvestigationsRoleMapping.createPatientInvestigationsRoleMapping = (req, res) => {
    async.auto({
      validateData: validateDataFunction,
      createPatientInvestigationsRoleMapping: ['validateData', createPatientInvestigationsRoleMappingFunction]
    })
    .then(async_auto_res => res.send(async_auto_res))
    .catch(async_auto_err => res.status(async_auto_err.error_code).send(async_auto_err));

    function validateDataFunction(callback) {
      let paramsCheck = {
        data: req.body,
        checkValType: {
          key: 'patientInvestigationsRoleMappings',
          checkValue: 'Array'
        }
      }
      utils.hasMandatoryParams(paramsCheck)
        .then(param_res => callback(null, param_res))
        .catch(param_err => callback(param_err));
    }

    function createPatientInvestigationsRoleMappingFunction(results, callback) {
      let createArray = Object.assign({}, req.body.patientInvestigationsRoleMappings);
      models['PatientInvestigationsRoleMapping'].bulkCreate(createArray, {
          returning: true
        })
        .then(create_res => {
          log.info('---PATIENT_PRESCRIPTION_CREATION_SUCCESS---');
          log.info(create_res);
          return callback(null, {
            success: true,
            message: 'Patient Investigations Role Mapping creation success',
            data: {
              patient_investigations_role_mapping: create_res
            }
          });
        })
        .catch(create_err => {
          log.error('---PATIENT_PRESCRIPTION_CREATION_FAILURE---');
          log.error(create_err);
          return callback({
            success: false,
            message: 'Patient Investigations Role Mapping creation failure',
            data: {}
          });
        });
    }
  }
}