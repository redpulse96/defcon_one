const log = require('../../../config/log_config').logger('patient_diagnosis_role_mappings_controller');
const utils = require('../../utility/utils');
const async = packageHelper.async;

module.exports = PatientDiagnosisRoleMapping => {

  PatientDiagnosisRoleMapping.createPatientDiagnosisRoleMapping = (req, res) => {
    async.auto({
        validateData: validateDataFunction,
        createPatientDiagnosisRoleMapping: ['validateData', createPatientDiagnosisRoleMappingFunction]
      })
      .then(asyncAutoRes => res.send(asyncAutoRes))
      .catch(asyncAutoErr => res.status(asyncAutoErr.error_code).send(asyncAutoErr));

    function validateDataFunction(callback) {
      let paramsCheck = {
        data: req.body,
        mandatoryParams: 'patientDiagnosisRoleMappings'
      }
      utils.hasMandatoryParams(paramsCheck)
        .then(paramRes => callback(null, paramRes))
        .catch(paramErr => callback(paramErr));
    }
  }

  const createPatientDiagnosisRoleMappingFunction = (result, callback) => {
    const {
      validateData
    } = result;
    let createArray = validateData.data.patientDiagnosisRoleMappings;
    models['PatientDiagnosisRoleMapping']
      .bulkCreate(createArray, {
        returning: true
      })
      .then(createRes => {
        log.info('---PATIENT_PRESCRIPTION_CREATION_SUCCESS---');
        log.info(createRes);
        return callback(null, {
          success: true,
          message: 'Patient Diagnosis Role Mapping creation success',
          data: {
            patient_diagnosis_role_mapping: createRes
          }
        });
      })
      .catch(createErr => {
        log.error('---PATIENT_PRESCRIPTION_CREATION_FAILURE---');
        log.error(createErr);
        return callback({
          success: false,
          message: 'Patient Diagnosis Role Mapping creation failure',
          data: {}
        });
      });
  }
}