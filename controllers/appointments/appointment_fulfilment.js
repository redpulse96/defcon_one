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

    let [validateDataError, validateDataResult] = await to(validateDataFunction(req));
    if (validateDataError) {
      return utils.generateResponse(validateDataError)(res);
    }

    let fetchCurrentAppointmentObj = {
      appointment_id: validateDataResult.data.appointment_id
    };
    let [fetchCurrentAppointmentError, fetchCurrentAppointmentResult] = await to(fetchCurrentAppointmentFunction(fetchCurrentAppointmentObj));
    if (fetchCurrentAppointmentError) {
      return utils.generateResponse(fetchCurrentAppointmentError)(res);
    }

    let checkStatusMatrixObj = {
      ...validateDataResult.data,
      appointment_detail: fetchCurrentAppointmentResult.data.appointment
    };
    let [checkStatusMatrixError] = await to(checkStatusMatrixFunction(checkStatusMatrixObj));
    if (checkStatusMatrixError) {
      return utils.generateResponse(checkStatusMatrixError)(res);
    }

    let rescheduleAppointmentObj = {
      ...validateDataResult.data
    };
    let [rescheduleAppointmentError, rescheduleAppointmentResult] = await to(rescheduleAppointmentFunction(rescheduleAppointmentObj));
    if (rescheduleAppointmentError) {
      return utils.generateResponse(rescheduleAppointmentError)(res);
    }

    let updateAppointmentStatusObj = {
      ...validateDataResult.data,
      ...rescheduleAppointmentResult,
      appointment_detail: fetchCurrentAppointmentResult.data.appointment
    };
    let [updateAppointmentStatusError, updateAppointmentStatusResult] = await to(updateAppointmentStatusFunction(updateAppointmentStatusObj));
    if (updateAppointmentStatusError) {
      return utils.generateResponse(updateAppointmentStatusError)(res);
    }

    let createAppointmentLogObj = {
      ...validateDataResult.data,
      ...updateAppointmentStatusResult.data
    };
    let [createAppointmentLogError] = await to(createAppointmentLogFunction(createAppointmentLogObj));
    if (createAppointmentLogError) {
      return utils.generateResponse(createAppointmentLogError)(res);
    }
    return utils.generateResponse(updateAppointmentStatusResult)(res);
  }

  function validateDataFunction(data) {
    return new Promise((resolve, reject) => {
      let paramsCheck = {
        data: data.body,
        mandatoryParams: APPOINTMENT_FULFILMENT
      }
      utils.hasMandatoryParams(paramsCheck)
        .then(paramRes => {
          return resolve(paramRes);
        })
        .catch(paramErr => {
          return reject(paramErr);
        });
    });
  }

  function fetchCurrentAppointmentFunction(data) {
    return new Promise((resolve, reject) => {
      let whereObj = {
        appointment_id: data.appointment_id,
        filterScope: 'activeScope',
        methodName: 'findOne'
      };
      Appointments.fetchAppointmentsByFilter(whereObj)
        .then(appointmentRes => {
          log.info('---APPOINTMENTS_FETCH_SUCCESS---');
          log.info(appointmentRes);
          if (appointmentRes) {
            return resolve(appointmentRes);
          } else {
            return reject({
              success: false,
              error_code: 500,
              message: 'No appointment exists',
              data: {}
            });
          }
        })
        .catch(appointmentErr => {
          log.info('---APPOINTMENTS_FETCH_FAILURE---');
          log.info(appointmentErr);
          return reject({
            success: false,
            error_code: 500,
            message: 'Internal server error',
            data: {}
          });
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
      let updateObj = {
        ...data
      };
      data.appointment_detail.appointment_status = data.appointment_status;
      if (data.isRescheduled) {
        updateObj = {
          updateObj,
          appointment_date: data.rescheduledData.rescheduled_date,
          rescheduled_date: data.rescheduledData.rescheduled_date,
          from_time: data.rescheduledData.from_time,
          to_time: data.rescheduledData.to_time
        };
      }
      data.appointment_detail.update(updateObj)
        .then(updateAppointmentRes => {
          log.info('---update_appointmentRes---');
          log.info(updateAppointmentRes);
          if (updateAppointmentRes) {
            return resolve({
              success: true,
              message: 'Appointment details updated',
              data: {
                appointment_details: updateAppointmentRes
              }
            });
          } else {
            return reject({
              success: false,
              error_code: 500,
              message: 'Appointment details could not be updated',
              data: {}
            });
          }
        })
        .catch(updateAppointmentErr => {
          log.error('---update_appointment_err---');
          log.error(updateAppointmentErr);
          return reject({
            success: false,
            error_code: 500,
            message: 'Could not update the appointment',
            data: {}
          });
        });
    });
  }

  function createAppointmentLogFunction(data) {
    return new Promise((resolve, reject) => {
      let createLogObj = {
        ...data
      };
      AppointmentLogs.createAppointmentLogs(createLogObj)
        .then(createLogRes => {
          return resolve(createLogRes);
        })
        .catch(createLogErr => {
          return reject(createLogErr);
        });
    });
  }
}
