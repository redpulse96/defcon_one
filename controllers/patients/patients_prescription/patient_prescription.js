const log = require('../../../config/log_config').logger('patient_prescriptions_controller');
const PatientPrescriptions = require(packageHelper.MODEL_CONFIG_DIR)['PatientPrescriptions'];
const utils = require('../../utility/utils');

PatientPrescriptions.fetchPatientPrescriptions = (req, res) => {

  let whereObj = Object.assign({}, req.params, {
    include: [{
      model: models['Appointments'],
      as: 'appointment',
      include: [{
        model: models['PatientDiagnosisRoleMapping'],
        as: 'patient_diagnosis_role_mapping'
      }, {
        model: models['PatientExaminationsRoleMapping'],
        as: 'patient_examinations_role_mapping'
      }, {
        model: models['PatientInvestigationsRoleMapping'],
        as: 'patient_investigations_role_mapping'
      }, {
        model: models['PatientSymptomsRoleMapping'],
        as: 'patient_symptoms_role_mapping'
      }]
    }]
  });
  models['PatientPrescriptions'].findOne(whereObj)
    .then(fetch_res => {
      log.info('---PATIENT_PRESCRIPTION_FETCH_SUCCESS---');
      log.info(fetch_res);
      return res.send({
        success: true,
        message: 'PatientPrescriptions Role Mapping fetching success',
        data: {
          patient_prescription: fetch_res
        }
      });
    })
    .catch(fetch_err => {
      log.info('---PATIENT_PRESCRIPTION_FETCH_FAILURE---');
      log.info(fetch_err);
      return res.status(500).send({
        success: false,
        message: 'Internal server error',
        data: {}
      });
    });
}

PatientPrescriptions.createPatientPrescriptions = (req, res) => {

  let createObj = Object.assign({}, req.body);
  createObj.reference_id = utils.GenerateUniqueID(10, 'A#vb');
  models['PatientPrescriptions'].create(createObj)
    .then(create_res => {
      log.info('---PATIENT_PRESCRIPTION_CREATION_SUCCESS---');
      log.info(create_res);
      return res.send({
        success: true,
        message: 'PatientPrescriptions Role Mapping creation success',
        data: {
          patient_prescription: create_res.toJSON()
        }
      });
    })
    .catch(create_err => {
      log.info('---PATIENT_PRESCRIPTION_CREATION_FAILURE---');
      log.info(create_err);
      return res.status(500).send({
        success: false,
        message: 'Internal server error',
        data: {}
      });
    });
}

module.exports = PatientPrescriptions;