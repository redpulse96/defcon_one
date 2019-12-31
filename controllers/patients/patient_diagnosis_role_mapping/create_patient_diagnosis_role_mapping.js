const log = require('../../../config/log_config').logger('patient_diagnosis_role_mappings_controller');
const utils = require('../../utility/utils');
const {
  to
} = require('../../utility/helper_function');

module.exports = PatientDiagnosisRoleMapping => {

  PatientDiagnosisRoleMapping.createPatientDiagnosisRoleMapping = async (req, res) => {

    let [validateDataError, validateDataResult] = await to(validateDataFunction(req));
    if (validateDataError) {
      return utils.generateResponse(validateDataError)(res);
    }

    let createPatientDiagnosisRoleMappingObj = {
      ...validateDataResult.data
    };
    let [createPatientDiagnosisRoleMappingError, createPatientDiagnosisRoleMappingResult] = await to(createPatientDiagnosisRoleMappingFunction(createPatientDiagnosisRoleMappingObj));
    if (createPatientDiagnosisRoleMappingError) {
      return utils.generateResponse(createPatientDiagnosisRoleMappingError)(res);
    }
    return utils.generateResponse(createPatientDiagnosisRoleMappingResult)(res);
  }

  function validateDataFunction(data) {
    return new Promise((resolve, reject) => {
      let paramsCheck = {
        data: data.body,
        mandatoryParams: ['patientDiagnosisRoleMappings']
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

  const createPatientDiagnosisRoleMappingFunction = data => {
    return new Promise((resolve, reject) => {
      let createArray = data.patientDiagnosisRoleMappings;
      models['PatientDiagnosisRoleMapping']
        .bulkCreate(createArray, {
          returning: true
        })
        .then(createRes => {
          log.info('---PATIENT_Diagnosis_CREATION_SUCCESS---');
          log.info(createRes);
          return resolve({
            success: true,
            message: 'Patient Diagnosis Role Mapping creation success',
            data: {
              patient_diagnosis_role_mapping: createRes
            }
          });
        })
        .catch(createErr => {
          log.error('---PATIENT_Diagnosis_CREATION_FAILURE---');
          log.error(createErr);
          return reject({
            success: false,
            message: 'Patient Diagnosis Role Mapping creation failure',
            data: {}
          });
        });
    });
  }
}
