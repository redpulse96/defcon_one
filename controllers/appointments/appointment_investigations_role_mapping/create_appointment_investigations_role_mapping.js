const log = require('../../../config/log_config').logger('appointment_investigations_role_mappings_controller');
const utils = require('../../utility/utils');
const {
  to
} = require('../../utility/helper_function');

module.exports = AppointmentInvestigationsRoleMapping => {

  AppointmentInvestigationsRoleMapping.createAppointmentInvestigationsRoleMapping = async (req, res) => {

    let [validateDataError, validateDataResult] = await to(validateDataFunction(req));
    if (validateDataError) {
      return utils.generateResponse(validateDataError)(res);
    }

    let createAppointmentInvestigationsRoleMappingObj = {
      ...validateDataResult.data
    };
    let [createAppointmentInvestigationsRoleMappingError, createAppointmentInvestigationsRoleMappingResult] = await to(createAppointmentInvestigationsRoleMappingFunction(createAppointmentInvestigationsRoleMappingObj));
    if (createAppointmentInvestigationsRoleMappingError) {
      return utils.generateResponse(createAppointmentInvestigationsRoleMappingError)(res);
    }
    return utils.generateResponse(createAppointmentInvestigationsRoleMappingResult)(res);
  }

  function validateDataFunction(data) {
    return new Promise((resolve, reject) => {
      let paramsCheck = {
        data: data.body,
        mandatoryParams: ['AppointmentInvestigationsRoleMappings']
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

  const createAppointmentInvestigationsRoleMappingFunction = data => {
    return new Promise((resolve, reject) => {
      let createArray = data.AppointmentInvestigationsRoleMappings;
      models['AppointmentInvestigationsRoleMapping']
        .bulkCreate(createArray, {
          returning: true
        })
        .then(createRes => {
          log.info('---appointment_investigations_CREATION_SUCCESS---');
          log.info(createRes);
          return resolve({
            success: true,
            message: 'Patient Investigations Role Mapping creation success',
            data: {
              appointment_investigations_role_mapping: createRes
            }
          });
        })
        .catch(createErr => {
          log.error('---appointment_investigations_CREATION_FAILURE---');
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
