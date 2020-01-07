const log = require('../../../config/log_config').logger('appointment_logs_helper');
const {
  arrayFn,
  objectFn
} = require('../../utility/helper_function');

module.exports = AppointmentLogs => {

  /**
   * @param {Object[]} data - Object with the details to create appointment log
   * @param {Number} data.appointment_id appointment id of the appointment to be created against
   * @param {String} data.appointment_status Status of the appointment to be created `pending` if not mentioned
   */
  AppointmentLogs.createAppointmentLogInstance = data => {
    return new Promise((resolve, reject) => {
      let noCreate = false;
      let createObj = {};
      data.appointment_id ? createObj.appointment_status = data.appointment_id : noCreate = true;
      data.appointment_status ? createObj.appointment_status = data.appointment_status : noCreate = true;
      data.doctor_remarks ? createObj.doctor_remarks = data.doctor_remarks : createObj.doctor_remarks = '';
      if (noCreate) {
        return reject({
          success: false,
          error_code: 500,
          message: 'Internal server error',
          data: {}
        });
      }
      try {
        models['AppointmentLogs'].create(createObj)
          .then(createAppointmentLogsRes => {
            log.info('---APPOINTMENTS_LOGS_CREATION_SUCCESS---');
            log.info(createAppointmentLogsRes);
            return resolve({
              success: true,
              message: 'Appointment logs creation success',
              data: {
                appointment: createAppointmentLogsRes
              }
            });
          })
          .catch(createAppointmentLogsErr => {
            log.error('---APPOINTMENTS_LOGS_CREATION_FAILURE---');
            log.error(createAppointmentLogsErr);
            return reject({
              success: false,
              error_code: 500,
              message: 'Appointment logs creation failure',
              data: {}
            })
          });
      } catch (error) {
        log.error('---ERROR_CAUGHT---');
        log.error(error);
        return reject({
          success: false,
          error_code: 500,
          message: 'Internal server error',
          data: {}
        });
      }
    });
  }

  /**
   * @param {Object[]} data - Array of objects with the details to create appointments
   * @param {Array} data.appointment_log_ids Array of appointment log ids of the appointment to be created against
   * @param {Array} data.appointment_ids Array of appointment ids of the appointment to be created against
   * @param {Number} data.appointment_log_id appointment log id of the appointment to be created against
   * @param {Number} data.appointment_id appointment id of the appointment to be created against
   * @param {String} data.appointment_status Status of the appointment to be created `pending` if not mentioned
   */
  AppointmentLogs.fetchAppointmentLogsByFilter = data => {
    return new Promise((resolve, reject) => {
      let filter = {
        where: {
          appointment_log_id: data.appointment_log_ids ? {
            $in: [data.appointment_log_ids]
          } : data.appointment_log_id ? data.appointment_log_id : null,
          appointment_id: data.appointment_ids ? {
            $in: [data.appointment_ids]
          } : data.appointment_id ? data.appointment_id : null,
          appointment_status: data.appointment_status ? {
            $like: '%' + data.appointment_status + '%'
          } : null,
          $and: data.$and ? data.$and : null,
          $like: data.$like ? data.$like : null,
          $or: data.$or ? data.$or : null
        }
      };
      !(data.methodName) && (data.methodName = 'findOne');
      !(data.filterScope) && (data.filterScope = 'defaultScope');
      filter && (filter = objectFn.compact(filter));
      filter.where && (filter.where = objectFn.compact(filter.where));
      filter.include && (filter.include = arrayFn.compact(filter.include));
      if (!filter.where) {
        return reject({
          success: false,
          message: 'Insuffiient parameters',
          data: {}
        });
      }
      try {
        models['AppointmentLogs'].scope(data.filterScope)[data.methodName](filter)
          .then(fetchAppointmentLogRes => {
            log.info('---APPOINTMENTS_LOGS_FETCH_SUCCESS---');
            log.info(fetchAppointmentLogRes);
            if (fetchAppointmentLogRes) {
              return resolve({
                success: true,
                message: 'Appointment logs fetch success',
                data: {
                  appointment: fetchAppointmentLogRes
                }
              });
            } else {
              return reject({
                success: false,
                error_code: 400,
                message: 'Appointment logs does not exist',
                data: {}
              });
            }
          })
          .catch(fetchAppointmentLogErr => {
            log.error('---APPOINTMENTS_LOGS_FETCH_FAILURE---');
            log.error(fetchAppointmentLogErr);
            return reject({
              success: false,
              error_code: 500,
              message: 'Appointment logs fetch failure',
              data: {}
            })
          });
      } catch (error) {
        log.error('---ERROR_CAUGHT---');
        log.error(error);
        return reject({
          success: false,
          error_code: 500,
          message: 'Internal server error',
          data: {}
        });
      }
    });
  }
}
