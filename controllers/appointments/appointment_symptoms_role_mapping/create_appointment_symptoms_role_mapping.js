const log = require('../../../config/log_config').logger('appointment_symptoms_role_mappings_controller');
const utils = require('../../utility/utils');
const {
  to
} = require('../../utility/helper_function');

module.exports = AppointmentSymptomsRoleMapping => {

  AppointmentSymptomsRoleMapping.createAppointmentSymptomsRoleMapping = async (req, res) => {

    let [validateDataError, validateDataResult] = await to(validateDataFunction(req));
    if (validateDataError) {
      return utils.generateResponse(validateDataError)(res);
    }

    let createAppointmentSymptomsRoleMappingObj = {
      ...validateDataResult.data
    };
    let [createAppointmentSymptomsRoleMappingError, createAppointmentSymptomsRoleMappingResult] = await to(createAppointmentSymptomsRoleMappingFunction(createAppointmentSymptomsRoleMappingObj));
    if (createAppointmentSymptomsRoleMappingError) {
      return utils.generateResponse(createAppointmentSymptomsRoleMappingError)(res);
    }
    return utils.generateResponse(createAppointmentSymptomsRoleMappingResult)(res);
  }

  function validateDataFunction(data) {
    return new Promise((resolve, reject) => {
      let paramsCheck = {
        data: data.body,
        mandatoryParams: ['AppointmentSymptomsRoleMappings']
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
