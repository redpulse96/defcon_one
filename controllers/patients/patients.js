const log = require('../../config/log_config').logger('patients_controller');
const Patients = require('../../models/patients/patients');

/**
 * @param {Number} user_id - user id of the user that is logged in
 */
Patients.patientsList = (req, res) => {
  if (!req.params) {
    return res.send({
      success: false,
      message: 'Insufficient parameters',
      data: {}
    });
  }
  let filterObj = Object.assign({}, {
    where: {
      created_by: req.params.user_id
    }
  });
  models['Patients'].findAll(filterObj)
    .then(patients_res => {
      log.info('---LIST_OF_PATIENTS_OF_THE_USER---');
      log.info(patients_res);
      return res.send({
        success: true,
        message: 'Patients list fetch success',
        data: {
          patients_list: patients_res
        }
      });
    })
    .catch(patients_err => {
      log.info('---LIST_OF_PATIENTS_ERROR---');
      log.info(patients_err);
      return res.send({
        success: false,
        message: 'Patients list fetch failure',
        data: {}
      });
    });
}

Patients.patientDetails = (req, res) => {

  let whereObj = Object.assign({}, {
    where: req.params
  }, {
    include: [{
      model: models['Appointments'],
      as: 'appointments',
      include: [{
        model: models['AppointmentLogs'],
        as: 'appointment_logs'
      }]
    }, {
      model: models['PatientPrescription'],
      as: 'patient_prescription',
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
  models['Patients'].findOne(whereObj)
    .then(fetch_res => {
      log.info('---PATIENTS_FETCH_SUCCESS---');
      log.info(fetch_res);
      return res.send({
        success: true,
        message: 'Patients Role Mapping fetching success',
        data: {
          patient_details: fetch_res
        }
      });
    })
    .catch(fetch_err => {
      log.error('---PATIENTS_FETCH_FAILURE---');
      log.error(fetch_err);
      return res.send({
        success: false,
        message: 'Patients Role Mapping fetching failure',
        data: {}
      });
    });
}

Patients.createPatients = (req, res) => {

  let createObj = Object.assign({}, req.body);
  models['Patients'].create(createObj)
    .then(create_res => {
      log.info('---PATIENTS_CREATION_SUCCESS---');
      log.info(create_res);
      return res.send({
        success: true,
        message: 'Patients Role Mapping creation success',
        data: {
          patients_role_mapping: create_res.toJSON()
        }
      });
    })
    .catch(create_err => {
      log.error('---PATIENTS_CREATION_FAILURE---');
      log.error(create_err);
      return res.send({
        success: false,
        message: 'Patients Role Mapping creation failure',
        data: {}
      });
    });
}

module.exports = Patients;