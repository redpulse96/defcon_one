const log = require('../../config/log_config').logger('appointments_controller');
const AppointmentLogs = require(packageHelper.MODEL_CONFIG_DIR)['AppointmentLogs'];
const moment = packageHelper.moment;
const utils = require('../utility/utils');
const {
  APPOINTMENT_STATUS,
  APPOINTMENT_STATUS_MATRIX,
  MANDATORY_PARAMS: {
    APPOINTMENT_FULFILMENT
  }
} = require('../../public/javascripts/constants');
const {
  to,
  objectFn
} = require('../utility/helper_function');

module.exports = Appointments => {

  Appointments.appointmentFulfilment = async (req, res) => {

    let [validateData_Error, validateData_Result] = await to(validateDataFunction(req));
    if (validateData_Error) {
      return utils.generateResponse(validateData_Error)(res);
    }

    let fetchCurrentAppointment_Obj = {
      appointment_id: validateData_Result.data.appointment_id
    };
    let [fetchCurrentAppointment_Error, fetchCurrentAppointment_Result] = await to(fetchCurrentAppointmentFunction(fetchCurrentAppointment_Obj));
    if (fetchCurrentAppointment_Error) {
      return utils.generateResponse(fetchCurrentAppointment_Error)(res);
    }

    let checkStatusMatrix_Obj = {
      ...validateData_Result.data,
      appointment_detail: fetchCurrentAppointment_Result.data.appointment
    };
    let [checkStatusMatrixError] = await to(checkStatusMatrixFunction(checkStatusMatrix_Obj));
    if (checkStatusMatrixError) {
      return utils.generateResponse(checkStatusMatrixError)(res);
    }

    let rescheduleAppointment_Obj = {
      ...validateData_Result.data
    };
    let [rescheduleAppointment_Error, rescheduleAppointment_Result] = await to(rescheduleAppointmentFunction(rescheduleAppointment_Obj));
    if (rescheduleAppointment_Error) {
      return utils.generateResponse(rescheduleAppointment_Error)(res);
    }

    let updateAppointmentStatus_Obj = {
      ...validateData_Result.data,
      ...rescheduleAppointment_Result,
      appointment_detail: fetchCurrentAppointment_Result.data.appointment
    };
    let [updateAppointmentStatus_Error, updateAppointmentStatus_Result] = await to(updateAppointmentStatusFunction(updateAppointmentStatus_Obj));
    if (updateAppointmentStatus_Error) {
      return utils.generateResponse(updateAppointmentStatus_Error)(res);
    }

    let createAppointmentLog_Obj = {
      ...validateData_Result.data,
      ...updateAppointmentStatus_Result.data
    };
    let [createAppointmentLog_Error] = await to(createAppointmentLogFunction(createAppointmentLog_Obj));
    if (createAppointmentLog_Error) {
      return utils.generateResponse(createAppointmentLog_Error)(res);
    }
    return utils.generateResponse(updateAppointmentStatus_Result)(res);
  }

  function validateDataFunction(data) {
    return new Promise((resolve, reject) => {
      let params_Check = {
        data: data.body,
        mandatoryParams: APPOINTMENT_FULFILMENT
      }
      utils.hasMandatoryParams(params_Check)
        .then(param_Result => {
          return resolve(param_Result);
        })
        .catch(param_Error => {
          return reject(param_Error);
        });
    });
  }

  function fetchCurrentAppointmentFunction(data) {
    return new Promise((resolve, reject) => {
      let where_Obj = {
        appointment_id: data.appointment_id,
        filterScope: 'activeScope',
        methodName: 'findOne'
      };
      Appointments.fetchAppointmentsByFilter(where_Obj)
        .then(appointmentRes => {
          log.info('---APPOINTMENTS_FETCH_SUCCESS---');
          return resolve(appointmentRes);
        })
        .catch(appointmentErr => {
          log.info('---APPOINTMENTS_FETCH_FAILURE---');
          log.info(appointmentErr);
          return reject(appointmentErr);
        });
    });
  }

  function checkStatusMatrixFunction(data) {
    return new Promise((resolve, reject) => {
      const statusMatrix = APPOINTMENT_STATUS_MATRIX;
      let currentStatus = data.appointment_detail.appointment_status;
      if (statusMatrix[currentStatus].indexOf(data.appointment_status) > -1) {
        return resolve({
          success: true,
          message: 'Can go to the current status',
          data: statusMatrix[currentStatus]
        });
      } else {
        return reject({
          success: false,
          error_code: 400,
          message: 'The appointment cannot be moved to the given status',
          data: {}
        });
      }
    });
  }

  function rescheduleAppointmentFunction(data) {
    return new Promise((resolve, reject) => {
      if (data.appointment_status === APPOINTMENT_STATUS.RESCHEDULED) {
        log.info('---APPOINTMENTResCHEDULING_REQUEST_RAISED---');
        if (!(objectFn.hasFn(data, 'rescheduled_date') || objectFn.hasFn(data, 'from_time') || objectFn.hasFn(data, 'to_time'))) {
          return reject({
            success: false,
            error_code: 400,
            message: 'Appointment rescheduled request raised,\nbut the required details have not been specified',
            data: {}
          });
        } else {
          let [fromDate, toDate] = [utils.validateKeys(() => moment(data.from_time).format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'), null), utils.validateKeys(() => moment(data.to_time).format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'), null)];
          let filter = {
            where: {
              $or: [{
                appointment_date: data.rescheduled_date,
                from_time: {
                  $between: [fromDate, toDate]
                }
              }, {
                rescheduled_date: data.rescheduled_date,
                to_time: {
                  $between: [fromDate, toDate]
                }
              }]
            }
          };
          models['Appointments'].scope('activeScope').findAll(filter)
            .then(appointmentDataRes => {
              log.info('---appointment_dateRes---');
              log.info(appointmentDataRes);
              if (appointmentDataRes && appointmentDataRes.length) {
                return reject({
                  success: false,
                  error_code: 200,
                  message: 'There is already an appointment scheduled at the specified slot,\nkindly choose a different slot',
                  data: {}
                });
              } else {
                data.doctor_remarks = 'Appointment has been rescheduled to ' + data.rescheduled_date + ' at slot ' + data.from_time + ' to ' + data.to_time;
                data.appointment_date = moment(data.rescheduled_date).format('YYYY-MM-DD');
                data.rescheduled_date = moment(data.rescheduled_date).format('YYYY-MM-DD');
                data.from_time = moment(data.from_time, 'HH:mm:ss').format('HH:mm:ss');
                data.to_time = moment(data.to_time, 'HH:mm:ss').format('HH:mm:ss');
                return resolve({
                  isRescheduled: true,
                  rescheduledData: data
                });
              }
            })
            .catch(appointmentDataErr => {
              log.error('---appointment_data_err---');
              log.error(appointmentDataErr);
              return reject({
                success: false,
                error_code: 500,
                message: 'Internal server error',
                data: {}
              });
            });
        }
      } else {
        return resolve({
          isRescheduled: false
        });
      }
    });
  }

  function updateAppointmentStatusFunction(data) {
    return new Promise((resolve, reject) => {
      let update_Obj = {
        ...data,
        ...data.appointment_detail
      };
      if (data.isRescheduled) {
        update_Obj = {
          update_Obj,
          appointment_date: data.rescheduledData.rescheduled_date,
          rescheduled_date: data.rescheduledData.rescheduled_date,
          from_time: data.rescheduledData.from_time,
          to_time: data.rescheduledData.to_time
        };
      }
      let updateAppointmentByInstance_Obj = {
        appointmentInstance: data.appointment_detail,
        updateAppointmentInstance_Obj: update_Obj
      }
      Appointments.updateAppointmentByInstance(updateAppointmentByInstance_Obj)
        .then(updateAppointment_Result => {
          log.info('---update_appointmentRes---');
          log.info(updateAppointment_Result);
          return resolve(updateAppointment_Result);
        })
        .catch(updateAppointment_Error => {
          log.error('---update_appointment_err---');
          log.error(updateAppointment_Error);
          return reject(updateAppointment_Error);
        });
    });
  }

  function createAppointmentLogFunction(data) {
    return new Promise((resolve, reject) => {
      let createLog_Obj = {
        ...data
      };
      AppointmentLogs.createAppointmentLogs(createLog_Obj)
        .then(createLog_Result => {
          return resolve(createLog_Result);
        })
        .catch(createLog_Error => {
          return reject(createLog_Error);
        });
    });
  }
}
