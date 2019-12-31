const log = require('../../../config/log_config').logger('patient_symptoms_role_mappings_controller');
const utils = require('../../utility/utils');
const {
  to
} = require('../../utility/helper_function');

module.exports = PatientSymptomsRoleMapping => {

  PatientSymptomsRoleMapping.createPatientSymptomsRoleMapping = async (req, res) => {

    let [validateDataError, validateDataResult] = await to(validateDataFunction(req));
    if (validateDataError) {
      return utils.generateResponse(validateDataError)(res);
    }

    let createPatientSymptomsRoleMappingObj = {
      ...validateDataResult.data
    };
    let [createPatientSymptomsRoleMappingError, createPatientSymptomsRoleMappingResult] = await to(createPatientSymptomsRoleMappingFunction(createPatientSymptomsRoleMappingObj));
    if (createPatientSymptomsRoleMappingError) {
      return utils.generateResponse(createPatientSymptomsRoleMappingError)(res);
    }
    return utils.generateResponse(createPatientSymptomsRoleMappingResult)(res);
  }

  function validateDataFunction(data) {
    return new Promise((resolve, reject) => {
      let paramsCheck = {
        data: data.body,
        mandatoryParams: ['patientSymptomsRoleMappings']
      }
      utils.hasMandatoryParams(paramsCheck)
        .then(paramRes => {
          return resolve(paramRes);
        })
        .catch(paramErr => {
          return reject(paramErr);
        });
    });
  }

  const createPatientSymptomsRoleMappingFunction = data => {
    return new Promise((resolve, reject) => {
      let createArray = data.patientSymptomsRoleMappings;
      models['PatientSymptomsRoleMapping']
        .bulkCreate(createArray, {
          returning: true
        })
        .then(createRes => {
          log.info('---PATIENT_Symptoms_CREATION_SUCCESS---');
          log.info(createRes);
          return resolve({
            success: true,
            message: 'Patient Symptoms Role Mapping creation success',
            data: {
              patient_Symptoms_role_mapping: createRes
            }
          });
        })
        .catch(createErr => {
          log.error('---PATIENT_Symptoms_CREATION_FAILURE---');
          log.error(createErr);
          return reject({
            success: false,
            message: 'Patient Symptoms Role Mapping creation failure',
            data: {}
          });
        });
    });
  }
}
