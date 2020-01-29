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
   * @param {String} data.doctor_remarks Doctors remarks for the appointment updation
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
            log.info('---createAppointmentLogsRes---');
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
            log.error('---createAppointmentLogsErr---');
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
            log.info('---fetchAppointmentLogRes---');
            log.info(fetchAppointmentLogRes);
            if (fetchAppointmentLogRes[0]) {
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
                error_code: 500,
                message: 'Appointment log details could not be updated',
                data: {}
              });
            }
          })
          .catch(fetchAppointmentLogErr => {
            log.error('---fetchAppointmentLogErr---');
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

  /**
   * @param {Object[]} data - Object of where filter and update object
   * @param {Object[]} data.filterObj - Object of the list of filters used to fetch appointment
   * @param {Number} data.filterObj.appointment_id appointment id of the appointment to be created against
   * @param {Object[]} data.updateObj - Object consists of attributes to be updated
   * @param {String} data.updateObj.appointment_status Status of the appointment to be created `pending` if not mentioned
   * @param {String} data.doctor_remarks Doctors remarks for the appointment updation
   */
  AppointmentLogs.updateAppointmentLogsByFilter = data => {
    return new Promise((resolve, reject) => {
      if (!objectFn.has(data, 'filterObj') || !(objectFn.has(data, 'updateObj'))) {
        return reject({
          success: false,
          error_code: 500,
          message: 'Insufficient parameters',
          data: {}
        });
      }
      let [filterObj, updateObj] = [objectFn.compact(data.filterObj), objectFn.compact(data.updateObj)];
      models['AppointmentLogs'].update(updateObj, filterObj)
        .then(updatedAppointmentLogsRes => {
          log.info('---updatedAppointmentLogsRes---');
          log.info(updatedAppointmentLogsRes);
          if (updatedAppointmentLogsRes[0]) {
            return resolve({
              success: true,
              message: 'Appointment details updated',
              data: {
                appointment_details: updatedAppointmentLogsRes[1]
              }
            });
          } else {
            return reject({
              success: false,
              error_code: 500,
              message: 'Appointment log details could not be updated',
              data: {}
            });
          }
        })
        .catch(updatedAppointmentLogsErr => {
          log.error('---updatedAppointmentLogsErr---');
          log.error(updatedAppointmentLogsErr);
          return reject({
            success: false,
            error_code: 500,
            message: 'Appointment log details could not be updated',
            data: {}
          });
        });
    });
  }

  /**
   * @param {Object[]} data - Object of where filter and update object
   * @param {Model} data.appointmentInstance - Model instance of the model whose attributes are to be updated
   * @param {Object[]} data.updateAppointmentInstanceObj - Object consists of attributes to be updated
   * @param {String} data.updateAppointmentInstanceObj.appointment_name Name of the appointment to be created
   * @param {Date} data.updateAppointmentInstanceObj.appointment_date Scheduled date of the appointment to be created
   * @param {Number} data.updateAppointmentInstanceObj.patient_id Patient id of the appointment to be created against
   * @param {String} data.updateAppointmentInstanceObj.appointment_status Status of the appointment to be created `pending` if not mentioned
   * @param {String} data.updateAppointmentInstanceObj.doctor_remarks Remarks added my the logged in doctor
   * @param {Date} data.updateAppointmentInstanceObj.rescheduled_date Re-scheduled date of the appointment, is `NULL` while creating
   * @param {Timestamp} data.updateAppointmentInstanceObj.from_time From time of the scheduled appointment
   * @param {Timestamp} data.updateAppointmentInstanceObj.to_time To time of the scheduled appointment
   */
  AppointmentLogs.updateAppointmentLogsByInstance = data => {
    return new Promise((resolve, reject) => {
      if (!objectFn.has(data, 'AppointmentLogInstance') || !(objectFn.has(data, 'updateAppointmentLogInstanceObj'))) {
        return reject({
          success: false,
          error_code: 400,
          message: 'Insufficient parameters',
          data: {}
        });
      }
      data['AppointmentLogInstance'].update(data['updateAppointmentLogInstanceObj'])
        .then(updateAppointmentLogsInstanceResult => {
          log.info('---updateAppointmentLogsInstanceResult---');
          log.info(updateAppointmentLogsInstanceResult);
          if (updateAppointmentLogsInstanceResult) {
            return resolve({
              success: true,
              message: 'Appointment Log details updated',
              data: {
                appointment_logs_details: updateAppointmentLogsInstanceResult
              }
            });
          } else {
            return reject({
              success: false,
              error_code: 500,
              message: 'AppointmentLogs details could not be updated',
              data: {}
            });
          }
        })
        .catch(updateAppointmentLogsInstanceError => {
          log.error('---updateAppointmentLogsInstanceError---');
          log.error(updateAppointmentLogsInstanceError);
          return reject({
            success: false,
            error_code: 500,
            message: 'AppointmentLogs details could not be updated',
            data: {}
          });
        });
    });
  }
}
