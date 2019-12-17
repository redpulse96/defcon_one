const log = require('../../../config/log_config').logger('patient_symptoms_role_mappings_controller');
const utils = require('../../utility/utils');
const async = packageHelper.async;

module.exports = PatientSymptomsRoleMapping => {

  PatientSymptomsRoleMapping.createPatientSymptomsRoleMapping = (req, res) => {
    async.auto({
      validateData: validateDataFunction,
      createPatientSymptomsRoleMapping: ['validateData', createPatientSymptomsRoleMappingFunction]
    })
      .then(asyncAutoRes => res.send(asyncAutoRes.createPatientSymptomsRoleMapping))
      .catch(asyncAutoErr => res.status(asyncAutoErr.error_code).send(asyncAutoErr));

    function validateDataFunction(callback) {
      let paramsCheck = {
        data: req.body,
        mandatoryParams: 'patientSymptomsRoleMappings'
      }
      utils.hasMandatoryParams(paramsCheck)
        .then(paramRes => callback(null, paramRes))
        .catch(paramErr => callback(paramErr));
    }

    function createPatientSymptomsRoleMappingFunction(results, callback) {
      const {
        validateData
      } = results;
      let createArray = validateData.data.patientSymptomsRoleMappings;
      models['PatientSymptomsRoleMapping'].bulkCreate(createArray, { returning: true })
        .then(createRes => {
          log.info('---PATIENT_PRESCRIPTION_CREATION_SUCCESS---');
          log.info(createRes);
          return callback(null, {
            success: true,
            message: 'Patient Symptoms Role Mapping creation success',
            data: {
              patient_symptoms_role_mapping: createRes
            }
          });
        })
        .catch(createErr => {
          log.error('---PATIENT_PRESCRIPTION_CREATION_FAILURE---');
          log.error(createErr);
          return callback({
            success: false,
            message: 'Patient Symptoms Role Mapping creation failure',
            data: {}
          });
        });
    }
  }
}