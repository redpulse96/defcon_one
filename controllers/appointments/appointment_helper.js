const log = require('../../config/log_config').logger('appointments_helper');
const moment = packageHelper.moment;
const {
  arrayFn,
  objectFn
} = require('../utility/helper_function');
const {
  APPOINTMENT_STATUS
} = require('../../public/javascripts/constants');

module.exports = Appointments => {

  /**
   * @param {Object[]} data - Object with the details to create appointments
   * @param {String} data.appointment_name Name of the appointment to be created
   * @param {Date} data.appointment_date Scheduled date of the appointment to be created
   * @param {Number} data.patient_id Patient id of the appointment to be created against
   * @param {String} data.appointment_status Status of the appointment to be created `pending` if not mentioned
   * @param {String} data.doctor_remarks Remarks added my the logged in doctor
   * @param {Date} data.rescheduled_date Re-scheduled date of the appointment, is `NULL` while creating
   * @param {Timestamp} data.from_time From time of the scheduled appointment
   * @param {Timestamp} data.to_time To time of the scheduled appointment
   */
  Appointments.createAppointmentsInstance = data => {
    return new Promise((resolve, reject) => {
      let noCreate = false;
      let createObj = {
        appointment_name: data.appointment_name ? data.appointment_name : null && (noCreate = true),
        appointment_date: data.appointment_date ? moment(data.appointment_date).format('YYYY-MM-DD') : null && (noCreate = true),
        patient_id: data.patient_id ? data.patient_id : null && (noCreate = true),
        appointment_status: data.appointment_status ? data.appointment_status : APPOINTMENT_STATUS.PENDING,
        doctor_remarks: data.doctor_remarks ? data.doctor_remarks : null && (createObj.doctor_remarks = ''),
        created_by: data.created_by ? data.created_by : null && (noCreate = true),
        rescheduled_date: data.rescheduled_date ? moment(data.rescheduled_date).format('YYYY-MM-DD') : null && (noCreate = true),
        from_time: data.from_time ? moment(data.from_time, 'HH:mm:ss').format('HH:mm:ss') : null && (noCreate = true),
        to_time: data.to_time ? moment(data.to_time, 'HH:mm:ss').format('HH:mm:ss') : null && (noCreate = true)
      };
      if (noCreate) {
        return reject({
          success: false,
          error_code: 500,
          message: 'Internal server error',
          data: {}
        });
      }
      createObj = objectFn.compact(createObj);
      try {
        models['Appointments'].create(createObj)
          .then(createAppointmentRes => {
            log.info('---createAppointmentRes---');
            log.info(createAppointmentRes);
            return resolve({
              success: true,
              message: 'Appointment creation success',
              data: {
                appointment: createAppointmentRes
              }
            });
          })
          .catch(createAppointmentErr => {
            log.error('---createAppointmentErr---');
            log.error(createAppointmentErr);
            return reject({
              success: false,
              error_code: 500,
              message: 'Appointment creation failure',
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
   * @param {Array} data.patient_ids Array of patient ids of the appointment to be created against
   * @param {Number} data.patient_id Patient id of the appointment to be created against
   * @param {Array} data.appointment_ids Array of appointment ids of the appointment to be created against
   * @param {Number} data.appointment_id appointment id of the appointment to be created against
   * @param {String} data.appointment_status Status of the appointment to be created `pending` if not mentioned
   * @param {Date} data.rescheduled_date Re-scheduled date of the appointment, is `NULL` while creating
   * @param {Timestamp} data.from_time From time of the scheduled appointment
   * @param {Timestamp} data.to_time To time of the scheduled appointment
   */
  Appointments.fetchAppointmentsByFilter = data => {
    return new Promise((resolve, reject) => {
      let filter = {
        include: data.include ? data.include : null,
        where: {
          patient_id: data.patient_ids ? {
            $in: [data.patient_ids]
          } : data.patient_id ? data.patient_id : null,
          appointment_id: data.appointment_ids ? {
            $in: [data.appointment_ids]
          } : data.appointment_id ? data.appointment_id : null,
          appointment_status: data.appointment_status ? {
            $like: '%' + data.appointment_status + '%'
          } : null,
          appointment_date: data.appointment_date ? moment(data.appointment_date).format('YYYY-MM-DD') : null,
          rescheduled_date: data.rescheduled_date ? moment(data.rescheduled_date).format('YYYY-MM-DD') : null,
          from_time: data.from_time ? moment(data.from_time, 'HH:mm:ss').format('HH:mm:ss') : null,
          to_time: data.to_time ? moment(data.to_time, 'HH:mm:ss').format('HH:mm:ss') : null,
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
        models['Appointments'].scope(data.filterScope)[data.methodName](filter)
          .then(fetchAppointmentRes => {
            log.info('---fetchAppointmentRes---');
            log.info(fetchAppointmentRes);
            if (fetchAppointmentRes) {
              return resolve({
                success: true,
                message: 'Appointment fetch success',
                data: {
                  appointment: fetchAppointmentRes
                }
              });
            } else {
              return reject({
                success: false,
                error_code: 400,
                message: 'Appointment does not exist',
                data: {}
              });
            }
          })
          .catch(fetchAppointmentErr => {
            log.error('---fetchAppointmentErr---');
            log.error(fetchAppointmentErr);
            return reject({
              success: false,
              error_code: 500,
              message: 'Appointment fetch failure',
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
   * @param {String} data.updateObj.appointment_name Name of the appointment to be created
   * @param {Date} data.updateObj.appointment_date Scheduled date of the appointment to be created
   * @param {Number} data.updateObj.patient_id Patient id of the appointment to be created against
   * @param {String} data.updateObj.appointment_status Status of the appointment to be created `pending` if not mentioned
   * @param {String} data.updateObj.doctor_remarks Remarks added my the logged in doctor
   * @param {Date} data.updateObj.rescheduled_date Re-scheduled date of the appointment, is `NULL` while creating
   * @param {Timestamp} data.updateObj.from_time From time of the scheduled appointment
   * @param {Timestamp} data.updateObj.to_time To time of the scheduled appointment
   */
  Appointments.updateAppointmentByFilter = data => {
    return new Promise((resolve, reject) => {
      if (!objectFn.has(data, 'filterObj') && !(objectFn.has(data, 'updateObj'))) {
        return reject({
          success: false,
          error_code: 500,
          message: 'Insufficient parameters',
          data: {}
        });
      }
      let [filterObj, updateObj] = [objectFn.compact(data.filterObj), objectFn.compact(data.updateObj)];
      models['Appointments'].update(updateObj, filterObj)
        .then(updatedAppointmentRes => {
          log.info('---updatedAppointmentRes---');
          log.info(updatedAppointmentRes);
          if (updatedAppointmentRes[0]) {
            return resolve({
              success: true,
              message: 'Appointment details updated',
              data: {
                appointment_details: updatedAppointmentRes[1]
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
        .catch(updatedAppointmentErr => {
          log.error('---updatedAppointmentErr---');
          log.error(updatedAppointmentErr);
          return reject({
            success: false,
            error_code: 500,
            message: 'Appointment details could not be updated',
            data: {}
          });
        });
    });
  }

  /**
   * @param {Object[]} data - Object of where filter and update object
   * @param {Model[]} data.appointmentInstance - Model instance of the model whose attributes are to be updated
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
  Appointments.updateAppointmentByInstance = data => {
    return new Promise((resolve, reject) => {
      if (!objectFn.has(data, 'appointmentInstance') || !(objectFn.has(data, 'updateAppointmentInstanceObj'))) {
        return reject({
          success: false,
          error_code: 400,
          message: 'Insufficient parameters',
          data: {}
        });
      }
      data['appointmentInstance'].update(data['updateAppointmentInstanceObj'])
        .then(updateAppointmentInstanceResult => {
          log.info('---updateAppointmentInstanceResult---');
          log.info(updateAppointmentInstanceResult);
          if (updateAppointmentInstanceResult) {
            return resolve({
              success: true,
              message: 'Appointment details updated',
              data: {
                appointment_details: updateAppointmentInstanceResult
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
        .catch(updateAppointmentInstanceError => {
          log.error('---updateAppointmentInstanceError---');
          log.error(updateAppointmentInstanceError);
          return reject({
            success: false,
            error_code: 500,
            message: 'Appointment details could not be updated',
            data: {}
          });
        });
    });
  }
}
