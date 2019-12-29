const log = require('../../../config/log_config').logger('patient_examinations_role_mappings_controller');
const utils = require('../../utility/utils');
const async = packageHelper.async;

module.exports = PatientExaminationsRoleMapping => {

  PatientExaminationsRoleMapping.createPatientExaminationsRoleMapping = (req, res) => {
    async.auto({
      validateData: validateDataFunction,
      createPatientExaminationsRoleMapping: ['validateData', createPatientExaminationsRoleMappingFunction]
    })
      .then(asyncAutoRes => res.send(asyncAutoRes))
      .catch(asyncAutoErr => res.status(asyncAutoErr.error_code).send(asyncAutoErr));

    function validateDataFunction(callback) {
      let paramsCheck = {
        data: req.body,
        mandatoryParams: ['patientExaminationsRoleMappings']
      }
      utils.hasMandatoryParams(paramsCheck)
        .then(paramRes => callback(null, paramRes))
        .catch(paramErr => callback(paramErr));
    }

    function createPatientExaminationsRoleMappingFunction(results, callback) {
      let createArray = req.body.patientExaminationsRoleMappings;
      models['PatientExaminationsRoleMapping'].bulkCreate(createArray, {
        returning: true
      })
        .then(createRes => {
          log.info('---PATIENT_PRESCRIPTION_CREATION_SUCCESS---');
          log.info(createRes);
          return callback(null, {
            success: true,
            message: 'Patient Examinations Role Mapping creation success',
            data: {
              patient_examinations_role_mapping: createRes
            }
          });
        })
        .catch(createErr => {
          log.error('---PATIENT_PRESCRIPTION_CREATION_FAILURE---');
          log.error(createErr);
          return callback({
            success: false,
            message: 'Patient Examinations Role Mapping creation failure',
            data: {}
          });
        });
    }
  }
}