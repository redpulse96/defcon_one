const log = require('../../../config/log_config').logger('patient_symptoms_role_mappings_controller');
const PatientSymptomsRoleMapping = require(packageHelper.MODEL_CONFIG_DIR)['PatientSymptomsRoleMapping'];

PatientSymptomsRoleMapping.fetchPatientSymptomsRoleMapping = (req, res) => {

  let whereObj = Object.assign({}, req.params, {
    include: [{
      model: models.SymptomsRoleMapping,
      as: 'symptoms_role_mapping'
    }, {
      model: models.Roles,
      as: 'role'
    }]
  });
  models.PatientSymptomsRoleMapping.findOne(whereObj)
    .then(fetch_res => {
      log.info('---PATIENT_PRESCRIPTION_FETCH_SUCCESS---');
      log.info(fetch_res);
      return res.send({
        success: true,
        message: 'Patient Symptoms Role Mapping fetching success',
        data: {
          patient_symptoms_role_mapping: fetch_res
        }
      });
    })
    .catch(fetch_err => {
      log.info('---PATIENT_PRESCRIPTION_FETCH_FAILURE---');
      log.info(fetch_err);
      return res.send({
        success: false,
        message: 'Patient Symptoms Role Mapping fetching failure',
        data: {
          patient_symptoms_role_mapping: fetch_err
        }
      });
    });
}

PatientSymptomsRoleMapping.createPatientSymptomsRoleMapping = (req, res) => {

  let createObj = Object.assign({}, req.body);
  models.PatientSymptomsRoleMapping.create(createObj)
    .then(create_res => {
      log.info('---PATIENT_PRESCRIPTION_CREATION_SUCCESS---');
      log.info(create_res);
      return res.send({
        success: true,
        message: 'Patient Symptoms Role Mapping creation success',
        data: {
          patient_symptoms_role_mapping: create_res.toJSON()
        }
      });
    })
    .catch(create_err => {
      log.info('---PATIENT_PRESCRIPTION_CREATION_FAILURE---');
      log.info(create_err);
      return res.send({
        success: false,
        message: 'Patient Symptoms Role Mapping creation failure',
        data: {
          patient_symptoms_role_mapping: create_err
        }
      });
    });
}

module.exports = PatientSymptomsRoleMapping;