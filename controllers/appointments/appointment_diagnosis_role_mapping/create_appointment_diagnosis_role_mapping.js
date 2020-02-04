const log = require('../../../config/log_config').logger('appointment_diagnosis_role_mappings_controller');
const utils = require('../../utility/utils');
const {
  to
} = require('../../utility/helper_function');

module.exports = AppointmentDiagnosisRoleMapping => {

  AppointmentDiagnosisRoleMapping.createAppointmentDiagnosisRoleMapping = async (req, res) => {

    let [validateData_Error, validateData_Result] = await to(validateDataFunction(req));
    if (validateData_Error) {
      return utils.generateResponse(validateData_Error)(res);
    }

    let createAppointmentDiagnosisRoleMapping_Obj = {
      ...validateData_Result.data
    };
    let [createAppointmentDiagnosisRoleMappingError, createAppointmentDiagnosisRoleMappingResult] = await to(createAppointmentDiagnosisRoleMappingFunction(createAppointmentDiagnosisRoleMapping_Obj));
    if (createAppointmentDiagnosisRoleMappingError) {
      return utils.generateResponse(createAppointmentDiagnosisRoleMappingError)(res);
    }
    return utils.generateResponse(createAppointmentDiagnosisRoleMappingResult)(res);
  }

  function validateDataFunction(data) {
    return new Promise((resolve, reject) => {
      let params_Check = {
        data: data.body,
        mandatoryParams: ['AppointmentDiagnosisRoleMappings']
      }
      utils.hasMandatoryParams(params_Check)
        .then(param_Result => {
          return resolve(param_Result);
        })
        .catch(param_Error => {
          return reject(param_Error);
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
