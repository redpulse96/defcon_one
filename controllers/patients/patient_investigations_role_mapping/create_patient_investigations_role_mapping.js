const log = require('../../../config/log_config').logger('patient_investigations_role_mappings_controller');
const utils = require('../../utility/utils');
const {
  to
} = require('../../utility/helper_function');

module.exports = PatientInvestigationsRoleMapping => {

  PatientInvestigationsRoleMapping.createPatientInvestigationsRoleMapping = async (req, res) => {

    let [validateDataError, validateDataResult] = await to(validateDataFunction(req));
    if (validateDataError) {
      return utils.generateResponse(validateDataError)(res);
    }

    let createPatientInvestigationsRoleMappingObj = {
      ...validateDataResult.data
    };
    let [createPatientInvestigationsRoleMappingError, createPatientInvestigationsRoleMappingResult] = await to(createPatientInvestigationsRoleMappingFunction(createPatientInvestigationsRoleMappingObj));
    if (createPatientInvestigationsRoleMappingError) {
      return utils.generateResponse(createPatientInvestigationsRoleMappingError)(res);
    }
    return utils.generateResponse(createPatientInvestigationsRoleMappingResult)(res);
  }

  function validateDataFunction(data) {
    return new Promise((resolve, reject) => {
      let paramsCheck = {
        data: data.body,
        mandatoryParams: ['patientInvestigationsRoleMappings']
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

  const createPatientInvestigationsRoleMappingFunction = data => {
    return new Promise((resolve, reject) => {
      let createArray = data.patientInvestigationsRoleMappings;
      models['PatientInvestigationsRoleMapping']
        .bulkCreate(createArray, {
          returning: true
        })
        .then(createRes => {
          log.info('---PATIENT_Investigations_CREATION_SUCCESS---');
          log.info(createRes);
          return resolve({
            success: true,
            message: 'Patient Investigations Role Mapping creation success',
            data: {
              patient_Investigations_role_mapping: createRes
            }
          });
        })
        .catch(createErr => {
          log.error('---PATIENT_Investigations_CREATION_FAILURE---');
          log.error(createErr);
          return reject({
            success: false,
            message: 'Patient Investigations Role Mapping creation failure',
            data: {}
          });
        });
    });
  }
}
