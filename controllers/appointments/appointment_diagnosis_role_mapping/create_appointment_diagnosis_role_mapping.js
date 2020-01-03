const log = require('../../../config/log_config').logger('appointment_diagnosis_role_mappings_controller');
const utils = require('../../utility/utils');
const {
  to
} = require('../../utility/helper_function');

module.exports = AppointmentDiagnosisRoleMapping => {

  AppointmentDiagnosisRoleMapping.createAppointmentDiagnosisRoleMapping = async (req, res) => {

    let [validateDataError, validateDataResult] = await to(validateDataFunction(req));
    if (validateDataError) {
      return utils.generateResponse(validateDataError)(res);
    }

    let createAppointmentDiagnosisRoleMappingObj = {
      ...validateDataResult.data
    };
    let [createAppointmentDiagnosisRoleMappingError, createAppointmentDiagnosisRoleMappingResult] = await to(createAppointmentDiagnosisRoleMappingFunction(createAppointmentDiagnosisRoleMappingObj));
    if (createAppointmentDiagnosisRoleMappingError) {
      return utils.generateResponse(createAppointmentDiagnosisRoleMappingError)(res);
    }
    return utils.generateResponse(createAppointmentDiagnosisRoleMappingResult)(res);
  }

  function validateDataFunction(data) {
    return new Promise((resolve, reject) => {
      let paramsCheck = {
        data: data.body,
        mandatoryParams: ['AppointmentDiagnosisRoleMappings']
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

  const createAppointmentDiagnosisRoleMappingFunction = data => {
    return new Promise((resolve, reject) => {
      let createArray = data.AppointmentDiagnosisRoleMappings;
      models['AppointmentDiagnosisRoleMapping']
        .bulkCreate(createArray, {
          returning: true
        })
        .then(createRes => {
          log.info('---appointment_diagnosis_CREATION_SUCCESS---');
          log.info(createRes);
          return resolve({
            success: true,
            message: 'Patient Diagnosis Role Mapping creation success',
            data: {
              appointment_diagnosis_role_mapping: createRes
            }
          });
        })
        .catch(createErr => {
          log.error('---appointment_diagnosis_CREATION_FAILURE---');
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
