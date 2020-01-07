const log = require('../../config/log_config').logger('appointments_controller');
const utils = require('../utility/utils');
const {
  to
} = require('../utility/helper_function');
const {
  MANDATORY_PARAMS: {
    APPOINTMENT_DETAIL
  }
} = require('../../public/javascripts/constants');

module.exports = Appointments => {
  Appointments.appointmentDetails = async (req, res) => {

    let [validateDataError, validateDataResult] = await to(validateDataFunction(req.params));
    if (validateDataError) {
      return utils.generateResponse(validateDataError)(res);
    }

    let fetchAppointmentDetailsObj = {
      ...validateDataResult.data
    };
    let [fetchAppointmentDetailsError, fetchAppointmentDetailsResult] = await to(fetchAppointmentDetailsFunction(fetchAppointmentDetailsObj));
    if (fetchAppointmentDetailsError) {
      return utils.generateResponse(fetchAppointmentDetailsError)(res);
    }
    return utils.generateResponse(fetchAppointmentDetailsResult)(res);
  }

  function validateDataFunction(data) {
    return new Promise((resolve, reject) => {
      let paramsCheck = {
        data: data,
        mandatoryParams: APPOINTMENT_DETAIL
      }
      utils.hasMandatoryParams(paramsCheck)
        .then(paramsRes => {
          resolve(paramsRes);
        })
        .catch(paramsErr => {
          reject(paramsErr);
        });
    });
  }

  function fetchAppointmentDetailsFunction(data) {
    return new Promise((resolve, reject) => {
      let filter = {
        appointment_id: data.appointment_id,
        filterScope: 'activeScope',
        methodName: 'findOne',
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
      };
      Appointments.fetchAppointmentsByFilter(filter)
        .then(appointmentDetails => {
          log.info('---APPOINTMENT_DETAILS---');
          log.info(appointmentDetails);
          return resolve(appointmentDetails);
        })
        .catch(appointmentDetailsErr => {
          log.error('---appointment_details_err---');
          log.error(JSON.stringify(appointmentDetailsErr));
          return reject(appointmentDetailsErr);
        });
    });
  }
}
