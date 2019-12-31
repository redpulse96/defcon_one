const log = require('../../../config/log_config').logger('patient_examinations_role_mappings_controller');
const utils = require('../../utility/utils');
const {
  to
} = require('../../utility/helper_function');

module.exports = PatientExaminationsRoleMapping => {

  PatientExaminationsRoleMapping.createPatientExaminationsRoleMapping = async (req, res) => {

    let [validateDataError, validateDataResult] = await to(validateDataFunction(req));
    if (validateDataError) {
      return utils.generateResponse(validateDataError)(res);
    }

    let createPatientExaminationsRoleMappingObj = {
      ...validateDataResult.data
    };
    let [createPatientExaminationsRoleMappingError, createPatientExaminationsRoleMappingResult] = await to(createPatientExaminationsRoleMappingFunction(createPatientExaminationsRoleMappingObj));
    if (createPatientExaminationsRoleMappingError) {
      return utils.generateResponse(createPatientExaminationsRoleMappingError)(res);
    }
    return utils.generateResponse(createPatientExaminationsRoleMappingResult)(res);
  }

  function validateDataFunction(data) {
    return new Promise((resolve, reject) => {
      let paramsCheck = {
        data: data.body,
        mandatoryParams: ['patientExaminationsRoleMappings']
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

  const createPatientExaminationsRoleMappingFunction = data => {
    return new Promise((resolve, reject) => {
      let createArray = data.patientExaminationsRoleMappings;
      models['PatientExaminationsRoleMapping']
        .bulkCreate(createArray, {
          returning: true
        })
        .then(createRes => {
          log.info('---PATIENT_Examinations_CREATION_SUCCESS---');
          log.info(createRes);
          return resolve({
            success: true,
            message: 'Patient Examinations Role Mapping creation success',
            data: {
              patient_Examinations_role_mapping: createRes
            }
          });
        })
        .catch(createErr => {
          log.error('---PATIENT_Examinations_CREATION_FAILURE---');
          log.error(createErr);
          return reject({
            success: false,
            message: 'Patient Examinations Role Mapping creation failure',
            data: {}
          });
        });
    });
  }
}
