const log = require('../../../config/log_config').logger('appointment_logs_helper');
const {
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
      models['AppointmentLogs'].create(createObj)
        .then(createRes => {
          log.info('---APPOINTMENTS_LOGS_CREATION_SUCCESS---');
          log.info(createRes);
          return resolve({
            success: true,
            message: 'Appointment logs creation success',
            data: {
              appointment: createRes
            }
          });
        })
        .catch(createErr => {
          log.error('---APPOINTMENTS_LOGS_CREATION_FAILURE---');
          log.error(createErr);
          return reject({
            success: false,
            error_code: 500,
            message: 'Appointment logs creation failure',
            data: {}
          })
        });
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
          } : null
        }
      };
      !(data.filter_scope) ? data.filter_scope = 'defaultScope': null;
      filter.where = objectFn.compact(filter.where);
      models['AppointmentLogs'].scope(data.filter_scope).findAll(filter)
        .then(createRes => {
          log.info('---APPOINTMENTS_LOGS_FETCH_SUCCESS---');
          log.info(createRes);
          return resolve({
            success: true,
            message: 'Appointment logs fetch success',
            data: {
              appointment: createRes
            }
          });
        })
        .catch(createErr => {
          log.error('---APPOINTMENTS_LOGS_FETCH_FAILURE---');
          log.error(createErr);
          return reject({
            success: false,
            error_code: 500,
            message: 'Appointment logs fetch failure',
            data: {}
          })
        });
    });
  }
}
