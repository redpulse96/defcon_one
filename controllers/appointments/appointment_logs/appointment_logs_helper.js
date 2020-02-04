const log = require('../../../config/log_config').logger('appointment_logs_helper');
const {
  arrayFn,
  objectFn
} = require('../../utility/helper_function');

module.exports = AppointmentLogs => {

  /**
   * @param {_Object[]} data - _Object with the details to create appointment log
   * @param {Number} data.appointment_id appointment id of the appointment to be created against
   * @param {String} data.appointment_status Status of the appointment to be created `pending` if not mentioned
   * @param {String} data.doctor_remarks Doctors remarks for the appointment updation
   */
  AppointmentLogs.createAppointmentLogInstance = data => {
    return new Promise((resolve, reject) => {
      let noCreate = false;
      let create_Obj = {};
      data.appointment_id ? create_Obj.appointment_status = data.appointment_id : noCreate = true;
      data.appointment_status ? create_Obj.appointment_status = data.appointment_status : noCreate = true;
      data.doctor_remarks ? create_Obj.doctor_remarks = data.doctor_remarks : create_Obj.doctor_remarks = '';
      if (noCreate) {
        return reject({
          success: false,
          error_code: 500,
          message: 'Internal server error',
          data: {}
        });
      }
      try {
        models['AppointmentLogs'].create(create_Obj)
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
   * @param {_Object[]} data - Array of objects with the details to create appointments
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
          .then(fetchAppointmentLog_Result => {
            log.info('---fetchAppointmentLog_Result---');
            log.info(fetchAppointmentLog_Result);
            if (fetchAppointmentLog_Result[0]) {
              return resolve({
                success: true,
                message: 'Appointment logs fetch success',
                data: {
                  appointment: fetchAppointmentLog_Result
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
          .catch(fetchAppointmentLog_Error => {
            log.error('---fetchAppointmentLog_Error---');
            log.error(fetchAppointmentLog_Error);
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
   * @param {_Object[]} data - _Object of where filter and update object
   * @param {_Object[]} data.filter_Obj - _Object of the list of filters used to fetch appointment
   * @param {Number} data.filter_Obj.appointment_id appointment id of the appointment to be created against
   * @param {_Object[]} data.update_Obj - _Object consists of attributes to be updated
   * @param {String} data.update_Obj.appointment_status Status of the appointment to be created `pending` if not mentioned
   * @param {String} data.doctor_remarks Doctors remarks for the appointment updation
   */
  AppointmentLogs.updateAppointmentLogsByFilter = data => {
    return new Promise((resolve, reject) => {
      if (!objectFn.has(data, 'filter_Obj') || !(objectFn.has(data, 'update_Obj'))) {
        return reject({
          success: false,
          error_code: 500,
          message: 'Insufficient parameters',
          data: {}
        });
      }
      let [filter_Obj, update_Obj] = [objectFn.compact(data.filter_Obj), objectFn.compact(data.update_Obj)];
      models['AppointmentLogs'].update(update_Obj, filter_Obj)
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
   * @param {_Object[]} data - _Object of where filter and update object
   * @param {Model} data.appointmentInstance - Model instance of the model whose attributes are to be updated
   * @param {_Object[]} data.updateAppointmentInstance_Obj - _Object consists of attributes to be updated
   * @param {String} data.updateAppointmentInstance_Obj.appointment_name Name of the appointment to be created
   * @param {Date} data.updateAppointmentInstance_Obj.appointment_date Scheduled date of the appointment to be created
   * @param {Number} data.updateAppointmentInstance_Obj.patient_id Patient id of the appointment to be created against
   * @param {String} data.updateAppointmentInstance_Obj.appointment_status Status of the appointment to be created `pending` if not mentioned
   * @param {String} data.updateAppointmentInstance_Obj.doctor_remarks Remarks added my the logged in doctor
   * @param {Date} data.updateAppointmentInstance_Obj.rescheduled_date Re-scheduled date of the appointment, is `NULL` while creating
   * @param {Timestamp} data.updateAppointmentInstance_Obj.from_time From time of the scheduled appointment
   * @param {Timestamp} data.updateAppointmentInstance_Obj.to_time To time of the scheduled appointment
   */
  AppointmentLogs.updateAppointmentLogsByInstance = data => {
    return new Promise((resolve, reject) => {
      if (!objectFn.has(data, 'AppointmentLogInstance') || !(objectFn.has(data, 'updateAppointmentLogInstance_Obj'))) {
        return reject({
          success: false,
          error_code: 400,
          message: 'Insufficient parameters',
          data: {}
        });
      }
      data['AppointmentLogInstance'].update(data['updateAppointmentLogInstance_Obj'])
        .then(updateAppointmentLogsInstance_Result => {
          log.info('---updateAppointmentLogsInstance_Result---');
          log.info(updateAppointmentLogsInstance_Result);
          if (updateAppointmentLogsInstance_Result) {
            return resolve({
              success: true,
              message: 'Appointment Log details updated',
              data: {
                appointment_logs_details: updateAppointmentLogsInstance_Result
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
        .catch(updateAppointmentLogsInstance_Error => {
          log.error('---updateAppointmentLogsInstance_Error---');
          log.error(updateAppointmentLogsInstance_Error);
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
