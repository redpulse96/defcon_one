const log = require('../../config/log_config').logger('patients_controller');
const utils = require('../utility/utils');

module.exports = Patients => {

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
          [OP.in]: utils.validateKeys(() => [req.user.username, req.user.parent.username], [], null)
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
        return res.status(500).send({
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
        }, {
          model: models['PatientPrescription'],
          as: 'patient_prescription'
        }, {
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
            message: 'Patients fetching success',
            data: {
              patient_details: fetch_res
            }
          });
        } else {
          return res.status(502).send({
            success: false,
            message: 'Patient does not exist',
            data: {}
          });
        }
      })
      .catch(fetch_err => {
        log.error('---PATIENTS_FETCH_FAILURE---');
        log.error(fetch_err);
        return res.status(500).send({
          success: false,
          message: 'Internal server error',
          data: {}
        });
      });
  }
};
