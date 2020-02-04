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

    let [validateData_Error, validateData_Result] = await to(validateDataFunction(req.params));
    if (validateData_Error) {
      return utils.generateResponse(validateData_Error)(res);
    }

    let fetchAppointmentDetails_Obj = {
      ...validateData_Result.data
    };
    let [fetchAppointmentDetails_Error, fetchAppointmentDetails_Result] = await to(fetchAppointmentDetailsFunction(fetchAppointmentDetails_Obj));
    if (fetchAppointmentDetails_Error) {
      return utils.generateResponse(fetchAppointmentDetails_Error)(res);
    }
    return utils.generateResponse(fetchAppointmentDetails_Result)(res);
  }

  function validateDataFunction(data) {
    return new Promise((resolve, reject) => {
      let params_Check = {
        data: data,
        mandatoryParams: APPOINTMENT_DETAIL
      }
      utils.hasMandatoryParams(params_Check)
        .then(params_Result => {
          resolve(params_Result);
        })
        .catch(params_Error => {
          reject(params_Error);
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
        .then(appointmentDetails_Result => {
          log.info('---APPOINTMENT_DETAILS---');
          log.info(appointmentDetails_Result);
          return resolve(appointmentDetails_Result);
        })
        .catch(appointmentDetails_Error => {
          log.error('---APPOINTMENT_DETAILS_ERR---');
          log.error(JSON.stringify(appointmentDetails_Error));
          return reject(appointmentDetails_Error);
        });
    });
  }
}
