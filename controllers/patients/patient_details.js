const log = require('../../config/log_config').logger('patients_controller');
const utils = require('../utility/utils');
const {
  PATIENT_NOT_EXISTS,
  INTERNAL_SERVER_ERROR
} = require('../../config/response_config');

module.exports = Patients => {

  Patients.patientDetails = (req, res) => {
    let whereObj = {
      where: req.params,
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
          model: models['AppointmentDiagnosisRoleMapping'],
          as: 'appointment_diagnosis_role_mapping',
          include: [{
            model: models['DiagnosisRoleMapping'],
            as: 'diagnosis_role_mapping',
            include: [{
              model: models['Diagnosis'],
              as: 'diagnosis',
            }, {
              model: models['Roles'],
              as: 'role',
            }]
          }]
        }, {
          model: models['AppointmentExaminationsRoleMapping'],
          as: 'appointment_examinations_role_mapping',
          include: [{
            model: models['ExaminationsRoleMapping'],
            as: 'examinations_role_mapping',
            include: [{
              model: models['Examinations'],
              as: 'examination',
            }, {
              model: models['Roles'],
              as: 'role',
            }]
          }]
        }, {
          model: models['AppointmentInvestigationsRoleMapping'],
          as: 'appointment_investigations_role_mapping',
          include: [{
            model: models['InvestigationsRoleMapping'],
            as: 'investigations_role_mapping',
            include: [{
              model: models['Investigations'],
              as: 'investigation',
            }, {
              model: models['Roles'],
              as: 'role',
            }]
          }]
        }, {
          model: models['AppointmentSymptomsRoleMapping'],
          as: 'appointment_symptoms_role_mapping',
          include: [{
            model: models['SymptomsRoleMapping'],
            as: 'symptoms_role_mapping',
            include: [{
              model: models['Symptoms'],
              as: 'symptom',
            }, {
              model: models['Roles'],
              as: 'role',
            }]
          }]
        }]
      }]
    };
    models['Patients'].findOne(whereObj)
      .then(fetchRes => {
        fetchRes = fetchRes.toJSON();
        log.info('---PATIENTS_FETCH_SUCCESS---');
        log.info(fetchRes);
        if (fetchRes) {
          return res.send({
            success: true,
            message: 'Patients fetching success',
            data: {
              patient_details: fetchRes
            }
          });
        } else {
          return utils.generateResponse(PATIENT_NOT_EXISTS)(res);
        }
      })
      .catch(fetchErr => {
        log.error('---PATIENTS_FETCH_FAILURE---');
        log.error(fetchErr);
        return utils.generateResponse(INTERNAL_SERVER_ERROR)(res);
      });
  }
}