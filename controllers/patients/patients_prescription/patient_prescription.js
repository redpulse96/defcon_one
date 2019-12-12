const log = require('../../../config/log_config').logger('patient_prescriptions_controller');
const PatientPrescription = require(packageHelper.MODEL_CONFIG_DIR)['PatientPrescription'];
const utils = require('../../utility/utils');

PatientPrescription.fetchPatientPrescription = (req, res) => {

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
  models['PatientPrescription'].findOne(whereObj)
    .then(fetchRes => {
      fetchRes = fetchRes.toJSON();
      log.info('---PATIENT_PRESCRIPTION_FETCH_SUCCESS---');
      log.info(fetchRes);
      return res.send({
        success: true,
        message: 'PatientPrescription fetching success',
        data: {
          patient_prescription: fetchRes
        }
      });
    })
    .catch(fetchErr => {
      log.info('---PATIENT_PRESCRIPTION_FETCH_FAILURE---');
      log.info(fetchErr);
      return res.status(500).send({
        success: false,
        message: 'Internal server error',
        data: {}
      });
    });
}

PatientPrescription.createPatientPrescription = (req, res) => {

  let createObj = Object.assign({}, req.body, { created_by: req.user.username });
  createObj.reference_id = utils.GenerateUniqueID(10, 'A#vb');
  models['PatientPrescription'].create(createObj)
    .then(createRes => {
      log.info('---PATIENT_PRESCRIPTION_CREATION_SUCCESS---');
      log.info(createRes);
      return res.send({
        success: true,
        message: 'PatientPrescription creation success',
        data: {
          patient_prescription: createRes.toJSON()
        }
      });
    })
    .catch(createErr => {
      log.info('---PATIENT_PRESCRIPTION_CREATION_FAILURE---');
      log.info(createErr);
      return res.status(500).send({
        success: false,
        message: 'Internal server error',
        data: {}
      });
    });
}

module.exports = PatientPrescription;