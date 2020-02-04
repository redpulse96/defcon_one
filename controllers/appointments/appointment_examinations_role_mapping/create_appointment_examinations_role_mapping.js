const log = require('../../../config/log_config').logger('appointment_examinations_role_mappings_controller');
const utils = require('../../utility/utils');
const {
  to
} = require('../../utility/helper_function');

module.exports = AppointmentExaminationsRoleMapping => {

  AppointmentExaminationsRoleMapping.createAppointmentExaminationsRoleMapping = async (req, res) => {

    let [validateData_Error, validateData_Result] = await to(validateDataFunction(req));
    if (validateData_Error) {
      return utils.generateResponse(validateData_Error)(res);
    }

    let createAppointmentExaminationsRoleMapping_Obj = {
      ...validateData_Result.data
    };
    let [createAppointmentExaminationsRoleMappingError, createAppointmentExaminationsRoleMappingResult] = await to(createAppointmentExaminationsRoleMappingFunction(createAppointmentExaminationsRoleMapping_Obj));
    if (createAppointmentExaminationsRoleMappingError) {
      return utils.generateResponse(createAppointmentExaminationsRoleMappingError)(res);
    }
    return utils.generateResponse(createAppointmentExaminationsRoleMappingResult)(res);
  }

  function validateDataFunction(data) {
    return new Promise((resolve, reject) => {
      let params_Check = {
        data: data.body,
        mandatoryParams: ['AppointmentExaminationsRoleMappings']
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

  const createAppointmentExaminationsRoleMappingFunction = data => {
    return new Promise((resolve, reject) => {
      let createArray = data.AppointmentExaminationsRoleMappings;
      models['AppointmentExaminationsRoleMapping']
        .bulkCreate(createArray, {
          returning: true
        })
        .then(createRes => {
          log.info('---appointment_examinations_CREATION_SUCCESS---');
          log.info(createRes);
          return resolve({
            success: true,
            message: 'Patient Examinations Role Mapping creation success',
            data: {
              appointment_examinations_role_mapping: createRes
            }
          });
        })
        .catch(createErr => {
          log.error('---appointment_examinations_CREATION_FAILURE---');
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
