const log = require('../../../config/log_config').logger('patient_prescriptions_controller');
const PatientPrescription = require(packageHelper.MODEL_CONFIG_DIR)['PatientPrescription'];
const utils = require('../../utility/utils');
const {
  INTERNAL_SERVER_ERROR
} = require('../../../config/response_config');

PatientPrescription.fetchPatientPrescription = (req, res) => {

  let whereObj = {
    ...req.params,
    include: [{
      model: models['Appointments'],
      as: 'appointment',
      include: [{
        model: models['AppointmentDiagnosisRoleMapping'],
        as: 'appointment_diagnosis_role_mapping'
      }, {
        model: models['AppointmentExaminationsRoleMapping'],
        as: 'appointment_examinations_role_mapping'
      }, {
        model: models['AppointmentInvestigationsRoleMapping'],
        as: 'appointment_investigations_role_mapping'
      }, {
        model: models['AppointmentSymptomsRoleMapping'],
        as: 'appointment_symptoms_role_mapping'
      }]
    }]
  };
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
      return utils.generateResponse(INTERNAL_SERVER_ERROR)(res);
    });
}

PatientPrescription.createPatientPrescription = (req, res) => {

  let createObj = {
    ...req.body,
    created_by: req.user.username
  };
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
      return utils.generateResponse(INTERNAL_SERVER_ERROR)(res);
    });
}

module.exports = PatientPrescription;