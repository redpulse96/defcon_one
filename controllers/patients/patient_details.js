const log = require('../../config/log_config').logger('patients_controller');

module.exports = Patients => {

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
          as: 'patient_diagnosis_role_mapping',
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
          model: models['PatientExaminationsRoleMapping'],
          as: 'patient_examinations_role_mapping',
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
          model: models['PatientInvestigationsRoleMapping'],
          as: 'patient_investigations_role_mapping',
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
          model: models['PatientSymptomsRoleMapping'],
          as: 'patient_symptoms_role_mapping',
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
    });
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
          return res.status(502).send({
            success: false,
            message: 'Patient does not exist',
            data: {}
          });
        }
      })
      .catch(fetchErr => {
        log.error('---PATIENTS_FETCH_FAILURE---');
        log.error(fetchErr);
        return res.status(500).send({
          success: false,
          message: 'Internal server error',
          data: {}
        });
      });
  }
}