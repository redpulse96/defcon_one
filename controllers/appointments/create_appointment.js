const log = require('../../config/log_config').logger('appointments_controller');
const AppointmentLogs = require(packageHelper.MODEL_CONFIG_DIR)['AppointmentLogs'];
const Patients = require(packageHelper.MODEL_CONFIG_DIR)['Patients'];
const moment = packageHelper.moment;
const utils = require('../utility/utils');
const {
  to
} = require('../utility/helper_function');
const {
  MANDATORY_PARAMS: {
    CREATE_APPOINTMENT
  }
} = require('../../public/javascripts/constants');

module.exports = Appointments => {

  Appointments.createAppointment = async (req, res) => {

    let [validateData_Error, validateData_Result] = await to(validateDataFunction(req));
    if (validateData_Error) {
      return utils.generateResponse(validateData_Error)(res);
    }

    let checkPatientExistance_Obj = {
      ...validateData_Result.data
    };
    let [checkPatientExistanceError] = await to(checkPatientExistanceFunction(checkPatientExistance_Obj));
    if (checkPatientExistanceError) {
      return utils.generateResponse(checkPatientExistanceError)(res);
    }

    let checkExistingAppointment_Obj = {
      ...validateData_Result.data
    };
    let [checkExistingAppointment_Error] = await to(checkExistingAppointment(checkExistingAppointment_Obj));
    if (checkExistingAppointment_Error) {
      return utils.generateResponse(checkExistingAppointment_Error)(res);
    }

    let createNewAppointment_Obj = {
      ...validateData_Result.data
    };
    let [createNewAppointment_Error, createNewAppointment_Result] = await to(createNewAppointmentFunction(createNewAppointment_Obj));
    if (createNewAppointment_Error) {
      return utils.generateResponse(createNewAppointment_Error)(res);
    }

    let createNewAppointmentLog_Obj = {
      ...validateData_Result.data,
      ...createNewAppointment_Result.data.appointment.dataValues
    };
    let [createAppointmentLog_Error] = await to(createAppointmentLogFunction(createNewAppointmentLog_Obj));
    if (createAppointmentLog_Error) {
      return utils.generateResponse(createAppointmentLog_Error)(res);
    }
    return utils.generateResponse(createNewAppointment_Result)(res);
  }

  function validateDataFunction(data) {
    return new Promise((resolve, reject) => {
      let params_Check = {
        data: data.body,
        mandatoryParams: CREATE_APPOINTMENT
      }
      utils.hasMandatoryParams(params_Check)
        .then(param_Result => {
          param_Result.data.user = data.user;
          resolve(param_Result);
        })
        .catch(param_Error => {
          reject(param_Error);
        });
    });
  }

  function checkPatientExistanceFunction(data) {
    return new Promise((resolve, reject) => {
      let filterPatient_Obj = {
        filterScope: 'activeScope',
        methodName: 'findOne',
        patient_id: data.patient_id
      };
      Patients.fetchPatientsByFilter(filterPatient_Obj)
        .then(patient_Result => {
          log.info('---patient_Result---');
          log.info(patient_Result);
          return resolve(patient_Result);
        })
        .catch(patient_Error => {
          log.error('---patient_Error---');
          log.error(patient_Error);
          return reject(patient_Error);
        });
    });
  }

  function checkExistingAppointment(data) {
    return new Promise((resolve, reject) => {
      let [fromDate, toDate] = [moment(data.from_time, 'HH:mm:ss').format('HH:mm:ss'), moment(data.to_time, 'HH:mm:ss').format('HH:mm:ss')];
      let filter_Obj = {
        ...data,
        filterScope: 'activeScope',
        methodName: 'findAll',
        assigned_to: data.user.username,
        appointment_date: moment(data.appointment_date).format('YYYY-MM-DD'),
        $or: [{
          from_time: {
            $between: [fromDate, toDate]
          }
        }, {
          to_time: {
            $between: [fromDate, toDate]
          }
        }]
      };
      Appointments.fetchAppointmentsByFilter(filter_Obj)
        .then(fetchAppointmentsByFilter_Result => {
          if (utils.validateKeys(() => fetchAppointmentsByFilter_Result.data.appointment, false, null)) {
            return resolve(fetchAppointmentsByFilter_Result);
          } else {
            return reject({
              success: false,
              error_code: 400,
              message: 'An appointment is already scheduled at this slot,\nkindly choose a different slot',
              data: {}
            });
          }
        })
        .catch(fetchAppointmentsByFilter_Error => {
          return reject(fetchAppointmentsByFilter_Error);
        });
    });
  }

  function createNewAppointmentFunction(data) {
    return new Promise((resolve, reject) => {
      let create_Obj = {
        ...data,
        appointment_date: moment(data.appointment_date).format('YYYY-MM-DD'),
        from_time: moment(data.from_time, 'HH:mm:ss').format('HH:mm:ss'),
        to_time: moment(data.to_time, 'HH:mm:ss').format('HH:mm:ss'),
        created_by: data.user.username
      };
      Appointments.createAppointmentsInstance(create_Obj)
        .then(createRes => {
          return resolve(createRes);
        })
        .catch(createErr => {
          return reject(createErr);
        });
    });
  }

  function createAppointmentLogFunction(data) {
    return new Promise((resolve, reject) => {
      let log_Obj = {
        ...data
      };
      AppointmentLogs.createAppointmentLogs(log_Obj)
        .then(logRes => {
          return resolve(logRes);
        })
        .catch(logErr => {
          return reject(logErr);
        });
    });
  }
}
