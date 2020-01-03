const log = require('../../../config/log_config').logger('appointment_examinations_role_mappings_controller');
const utils = require('../../utility/utils');
const {
  to
} = require('../../utility/helper_function');

module.exports = AppointmentExaminationsRoleMapping => {

  AppointmentExaminationsRoleMapping.createAppointmentExaminationsRoleMapping = async (req, res) => {

    let [validateDataError, validateDataResult] = await to(validateDataFunction(req));
    if (validateDataError) {
      return utils.generateResponse(validateDataError)(res);
    }

    let createAppointmentExaminationsRoleMappingObj = {
      ...validateDataResult.data
    };
    let [createAppointmentExaminationsRoleMappingError, createAppointmentExaminationsRoleMappingResult] = await to(createAppointmentExaminationsRoleMappingFunction(createAppointmentExaminationsRoleMappingObj));
    if (createAppointmentExaminationsRoleMappingError) {
      return utils.generateResponse(createAppointmentExaminationsRoleMappingError)(res);
    }
    return utils.generateResponse(createAppointmentExaminationsRoleMappingResult)(res);
  }

  function validateDataFunction(data) {
    return new Promise((resolve, reject) => {
      let paramsCheck = {
        data: data.body,
        mandatoryParams: ['AppointmentExaminationsRoleMappings']
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
