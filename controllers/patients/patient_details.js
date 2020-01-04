const log = require('../../config/log_config').logger('patients_controller');
const utils = require('../utility/utils');

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
        log.info('---fetchRes---');
        log.info(fetchRes);
        fetchRes.data = fetchRes.data.patient_details.toJSON();
        return utils.generateResponse(fetchRes)(res);
      })
      .catch(fetchErr => {
        log.error('---fetchErr--');
        log.error(fetchErr);
        return utils.generateResponse(fetchErr)(res);
      });
  }
}
