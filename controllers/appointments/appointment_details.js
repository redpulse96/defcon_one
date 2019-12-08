const log = require('../../config/log_config').logger('appointments_controller');
const utils = require('../utility/utils');
const async = packageHelper.async;

module.exports = Appointments => {
  Appointments.AppointmentDetails = (req, res) => {
    async.auto({
      validateData: validateDataFunction,
      fetchAppointmentDetails: ['validateData', fetchAppointmentDetailsFunction]
    })
    .then(async_auto_res => res.send(async_auto_res))
    .catch(async_auto_err => res.status(async_auto_err.error_code).send(async_auto_err));

    function validateDataFunction(callback) {
      let paramsCheck = {
        data: req.params,
        mandatoryParams: ['appointment_id']
      }
      utils.hasMandatoryParams(paramsCheck)
        .then(params_res => callback(null, params_res))
        .catch(params_err => callback(params_err));
    }

    function fetchAppointmentDetailsFunction(results, callback) {
      const { validateData } = results;
      let filter = {
        where: {
          appointment_id: validateData.data.appointment_id,
          is_active: true,
          is_archived: false
        },
        include: [{
          model: models['AppointmentLogs'],
          as: 'appointment_logs'
        }, {
          model: models['Patients'],
          as: 'patient'
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
      };
      models['Appointments'].findOne(filter)
      .then(appointment_details => {
        log.info('---APPOINTMENT_DETAILS---');
        log.info(appointment_details);
        if (appointment_details) {
          return callback(null, {
            success: true,
            message: 'Appointment details fetched',
            data: {
              appointment_details
            }
          });
        } else {
          return callback({
            success: false,
            error_code: 500,
            message: 'Internal server error',
            data: {}
          });
        }
      })
      .catch(appointment_details_err => {
        log.error('---appointment_details_err---');
        log.error(JSON.stringify(appointment_details_err));
        return callback({
          success: false,
          error_code: 500,
          message: 'Internal server error',
          data: {}
        });
      });
    }
  }
}