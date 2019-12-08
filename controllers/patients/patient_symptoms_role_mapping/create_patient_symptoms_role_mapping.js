const log = require('../../../config/log_config').logger('patient_symptoms_role_mappings_controller');
const utils = require('../../utility/utils');

module.exports = PatientSymptomsRoleMapping => {

  PatientSymptomsRoleMapping.createPatientSymptomsRoleMapping = (req, res) => {
    async.auto({
      validateData: validateDataFunction,
      createPatientSymptomsRoleMapping: ['validateData', createPatientSymptomsRoleMappingFunction]
    })
      .then(async_auto_res => res.send(async_auto_res))
      .catch(async_auto_err => res.status(async_auto_err.error_code).send(async_auto_err));

    function validateDataFunction(callback) {
      let paramsCheck = {
        data: req.body,
        checkValType: {
          key: patientSymptomsRoleMappings,
          checkValue: 'Array'
        }
      }
      utils.hasMandatoryParams(paramsCheck)
        .then(param_res => callback(null, param_res))
        .catch(param_err => callback(param_err));
    }

    function createPatientSymptomsRoleMappingFunction(results, callback) {
      let createArray = Object.assign({}, req.body.patientSymptomsRoleMappings);
      models['PatientSymptomsRoleMapping'].bulkCreate(createArray, { returning: true })
        .then(create_res => {
          log.info('---PATIENT_PRESCRIPTION_CREATION_SUCCESS---');
          log.info(create_res);
          return callback(null, {
            success: true,
            message: 'Patient Symptoms Role Mapping creation success',
            data: {
              patient_symptoms_role_mapping: create_res.toJSON()
            }
          });
        })
        .catch(create_err => {
          log.error('---PATIENT_PRESCRIPTION_CREATION_FAILURE---');
          log.error(create_err);
          return callback({
            success: false,
            message: 'Patient Symptoms Role Mapping creation failure',
            data: {}
          });
        });
    }
  }
}