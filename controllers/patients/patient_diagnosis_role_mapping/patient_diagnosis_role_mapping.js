const log = require('../../../config/log_config').logger('patient_diagnosis_role_mappings_controller');
const PatientDiagnosisRoleMapping = require(packageHelper.MODEL_CONFIG_DIR)['PatientDiagnosisRoleMapping'];

PatientDiagnosisRoleMapping.fetchPatientDiagnosisRoleMapping = (req, res) => {

  let whereObj = Object.assign({}, req.params, {
    include: [{
      model: models.DiagnosisRoleMapping,
      as: 'diagnosis_role_mapping'
    }, {
      model: models.Roles,
      as: 'role'
    }]
  });
  models.PatientDiagnosisRoleMapping.findOne(whereObj)
    .then(fetch_res => {
      log.info('---PATIENT_PRESCRIPTION_FETCH_SUCCESS---');
      log.info(fetch_res);
      return res.send({
        success: true,
        message: 'Patient Diagnosis Role Mapping fetching success',
        data: {
          patient_diagnosis_role_mapping: fetch_res
        }
      });
    })
    .catch(fetch_err => {
      log.info('---PATIENT_PRESCRIPTION_FETCH_FAILURE---');
      log.info(fetch_err);
      return res.send({
        success: false,
        message: 'Patient Diagnosis Role Mapping fetching failure',
        data: {
          patient_diagnosis_role_mapping: fetch_err
        }
      });
    });
}

PatientDiagnosisRoleMapping.createPatientDiagnosisRoleMapping = (req, res) => {

  let createArray = Object.assign({}, req.body);
  models['PatientDiagnosisRoleMapping'].bulkCreate(createArray, { returning: true })
    .then(create_res => {
      log.info('---PATIENT_PRESCRIPTION_CREATION_SUCCESS---');
      log.info(create_res);
      return res.send({
        success: true,
        message: 'Patient Diagnosis Role Mapping creation success',
        data: {
          patient_diagnosis_role_mapping: create_res.toJSON()
        }
      });
    })
    .catch(create_err => {
      log.info('---PATIENT_PRESCRIPTION_CREATION_FAILURE---');
      log.info(create_err);
      return res.send({
        success: false,
        message: 'Patient Diagnosis Role Mapping creation failure',
        data: {
          patient_diagnosis_role_mapping: create_err
        }
      });
    });
}

module.exports = PatientDiagnosisRoleMapping;