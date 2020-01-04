const log = require('../../config/log_config').logger('patients_controller');
const utils = require('../utility/utils');
const {
  PATIENT_NOT_EXISTS
} = require('../../config/response_config');

module.exports = Patients => {

  Patients.patientDetails = (req, res) => {
    let filterObj = {
      ...req.params,
      methodName: 'findOne',
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
    Patients.fetchPatientsByFilter(filterObj)
      .then(fetchRes => {
        fetchRes.data = fetchRes.data.patient_details.toJSON();
        if (fetchRes) {
          return utils.generateResponse(fetchRes)(res);
        } else {
          return utils.generateResponse(PATIENT_NOT_EXISTS)(res);
        }
      })
      .catch(fetchErr => {
        return utils.generateResponse(fetchErr)(res);
      });
  }
}
