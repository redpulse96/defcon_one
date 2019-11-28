const log = require('../../config/log_config').logger('patients_controller');
const Patients = require('../../models/patients/patients');

const async = packageHelper.async;
/**
 * @param {String} username - username of the user that is logged in
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
      created_by: {
        [OP.in]: [req.user.username, req.user.parent.username]
      }
    }
  });
  models['Patients'].scope('activeScope').findAll(filterObj)
    .then(patients_res => {
      let response;
      log.info('---LIST_OF_PATIENTS_OF_THE_USER---');
      log.info(patients_res);
      if (patients_res && patients_res.length) {
        response = {
          success: true,
          message: 'Patients list fetch success',
          data: {
            patients_list: patients_res
          }
        };
      } else {
        response = {
          success: false,
          message: 'Patients list fetch success',
          data: {}
        };
      }
      return res.send(response);
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
      if (fetch_res) {
        return res.send({
          success: true,
          message: 'Patients Role Mapping fetching success',
          data: {
            patient_details: fetch_res
          }
        });
      }
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

  validateData = callback => {
    let paramsCheck = {
      data: req.body,
      mandatoryParams: ['patient_name', 'mobile_no', 'date_of_birth']
    }
    utils.hasMandatoryParams(paramsCheck)
      .then(res => { return callback(null, res) })
      .catch(err => { return callback(err) });
  }

  createPatientFunction = callback => {
  let createObj = Object.assign({}, req.body, { created_by: req.user.username });
  models['Patients'].scope('activeScope').findOrCreate({
    where: {
      mobile_no: createObj.mobile_no,
      is_active: true,
      is_archived: false
    },
    defaults: createObj
  })
    .then(([create_res, is_new]) => {
      log.info('---PATIENTS_CREATION_SUCCESS---');
      log.info(create_res, is_new);
      if (is_new) {
        return callback({
          success: true,
          message: 'Patients creation success',
          data: {
            patient: create_res.toJSON()
          }
        });
      } else {
        return callback(null, {
          success: false,
          message: 'Mobile number already exists,\nkindly priovide a different mobile number',
          data: {}
        });
      }
    })
    .catch(create_err => {
      log.error('---PATIENTS_CREATION_FAILURE---');
      log.error(create_err);
      return callback({
        success: false,
        error_code: 500,
        message: 'Patients creation failure',
        data: {}
      });
    });
  }

  async.auto({
    validateData: validateData,
    createPatient: ['validateData', createPatientFunction]
  }, (async_auto_error, async_auto_result) => {
    if (async_auto_error) {
      return res.status(async_auto_error.error_code).send(async_auto_error);
    } else {
      return res.send(async_auto_result.createPatient);
    }
  });
}

module.exports = Patients;