const log = require('../../config/log_config').logger('appointments_controller');
const utils = require('../utility/utils');
const async = packageHelper.async;

module.exports = Appointments => {
  Appointments.appointmentDetails = (req, res) => {
    async.auto({
      validateData: validateDataFunction,
      fetchAppointmentDetails: ['validateData', fetchAppointmentDetailsFunction]
    })
      .then(asyncAutoRes => res.send(asyncAutoRes))
      .catch(asyncAutoErr => res.status(asyncAutoErr.error_code).send(asyncAutoErr));

    function validateDataFunction(callback) {
      let paramsCheck = {
        data: req.params,
        mandatoryParams: ['appointment_id']
      }
      utils.hasMandatoryParams(paramsCheck)
        .then(paramsRes => callback(null, paramsRes))
        .catch(paramsErr => callback(paramsErr));
    }
  }

  const fetchAppointmentDetailsFunction = (result, callback) => {
    const {
      validateData
    } = result;
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
      .then(appointmentDetails => {
        log.info('---APPOINTMENT_DETAILS---');
        log.info(appointmentDetails);
        if (appointmentDetails) {
          return callback(null, {
            success: true,
            message: 'Appointment details fetched',
            data: {
              appointmentDetails
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
      .catch(appointmentDetailsErr => {
        log.error('---appointment_details_err---');
        log.error(JSON.stringify(appointmentDetailsErr));
        return callback({
          success: false,
          error_code: 500,
          message: 'Internal server error',
          data: {}
        });
      });
  }
}