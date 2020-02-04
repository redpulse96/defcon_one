const log = require('../../../config/log_config').logger('appointment_symptoms_role_mappings_controller');
const utils = require('../../utility/utils');
const {
  to
} = require('../../utility/helper_function');

module.exports = AppointmentSymptomsRoleMapping => {

  AppointmentSymptomsRoleMapping.createAppointmentSymptomsRoleMapping = async (req, res) => {

    let [validateData_Error, validateData_Result] = await to(validateDataFunction(req));
    if (validateData_Error) {
      return utils.generateResponse(validateData_Error)(res);
    }

    let createAppointmentSymptomsRoleMapping_Obj = {
      ...validateData_Result.data
    };
    let [createAppointmentSymptomsRoleMappingError, createAppointmentSymptomsRoleMappingResult] = await to(createAppointmentSymptomsRoleMappingFunction(createAppointmentSymptomsRoleMapping_Obj));
    if (createAppointmentSymptomsRoleMappingError) {
      return utils.generateResponse(createAppointmentSymptomsRoleMappingError)(res);
    }
    return utils.generateResponse(createAppointmentSymptomsRoleMappingResult)(res);
  }

  function validateDataFunction(data) {
    return new Promise((resolve, reject) => {
      let params_Check = {
        data: data.body,
        mandatoryParams: ['AppointmentSymptomsRoleMappings']
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

  const createAppointmentSymptomsRoleMappingFunction = data => {
    return new Promise((resolve, reject) => {
      let createArray = data.AppointmentSymptomsRoleMappings;
      models['AppointmentSymptomsRoleMapping']
        .bulkCreate(createArray, {
          returning: true
        })
        .then(createRes => {
          log.info('---appointment_symptoms_CREATION_SUCCESS---');
          log.info(createRes);
          return resolve({
            success: true,
            message: 'Patient Symptoms Role Mapping creation success',
            data: {
              appointment_symptoms_role_mapping: createRes
            }
          });
        })
        .catch(createErr => {
          log.error('---appointment_symptoms_CREATION_FAILURE---');
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
