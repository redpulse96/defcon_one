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
   * @param {_Object[]} data - _Object with the details to create appointments
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
      let create_Obj = {
        appointment_name: data.appointment_name ? data.appointment_name : null && (noCreate = true),
        appointment_date: data.appointment_date ? moment(data.appointment_date).format('YYYY-MM-DD') : null && (noCreate = true),
        patient_id: data.patient_id ? data.patient_id : null && (noCreate = true),
        appointment_status: data.appointment_status ? data.appointment_status : APPOINTMENT_STATUS.PENDING,
        doctor_remarks: data.doctor_remarks ? data.doctor_remarks : null && (create_Obj.doctor_remarks = ''),
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
      create_Obj = objectFn.compact(create_Obj);
      try {
        models['Appointments'].create(create_Obj)
          .then(createAppointment_Result => {
            log.info('---createAppointment_Result---');
            log.info(createAppointment_Result);
            return resolve({
              success: true,
              message: 'Appointment creation success',
              data: {
                appointment: createAppointment_Result
              }
            });
          })
          .catch(createAppointment_Error => {
            log.error('---createAppointment_Error---');
            log.error(createAppointment_Error);
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
   * @param {_Object[]} data - Array of objects with the details to create appointments
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
          .then(fetchAppointment_Result => {
            log.info('---fetchAppointment_Result---');
            log.info(fetchAppointment_Result);
            if (fetchAppointment_Result) {
              return resolve({
                success: true,
                message: 'Appointment fetch success',
                data: {
                  appointment: fetchAppointment_Result
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
          .catch(fetchAppointment_Error => {
            log.error('---fetchAppointment_Error---');
            log.error(fetchAppointment_Error);
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
   * @param {_Object[]} data - _Object of where filter and update object
   * @param {_Object[]} data.filter_Obj - _Object of the list of filters used to fetch appointment
   * @param {Number} data.filter_Obj.appointment_id appointment id of the appointment to be created against
   * @param {_Object[]} data.update_Obj - _Object consists of attributes to be updated
   * @param {String} data.update_Obj.appointment_name Name of the appointment to be created
   * @param {Date} data.update_Obj.appointment_date Scheduled date of the appointment to be created
   * @param {Number} data.update_Obj.patient_id Patient id of the appointment to be created against
   * @param {String} data.update_Obj.appointment_status Status of the appointment to be created `pending` if not mentioned
   * @param {String} data.update_Obj.doctor_remarks Remarks added my the logged in doctor
   * @param {Date} data.update_Obj.rescheduled_date Re-scheduled date of the appointment, is `NULL` while creating
   * @param {Timestamp} data.update_Obj.from_time From time of the scheduled appointment
   * @param {Timestamp} data.update_Obj.to_time To time of the scheduled appointment
   */
  Appointments.updateAppointmentByFilter = data => {
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
      models['Appointments'].update(update_Obj, filter_Obj)
        .then(updatedAppointment_Result => {
          log.info('---updatedAppointment_Result---');
          log.info(updatedAppointment_Result);
          if (updatedAppointment_Result[0]) {
            return resolve({
              success: true,
              message: 'Appointment details updated',
              data: {
                appointment_details: updatedAppointment_Result[1]
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
        .catch(updatedAppointment_Error => {
          log.error('---updatedAppointment_Error---');
          log.error(updatedAppointment_Error);
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
   * @param {_Object[]} data - _Object of where filter and update object
   * @param {Model[]} data.appointmentInstance - Model instance of the model whose attributes are to be updated
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
  Appointments.updateAppointmentByInstance = data => {
    return new Promise((resolve, reject) => {
      if (!objectFn.has(data, 'appointmentInstance') || !(objectFn.has(data, 'updateAppointmentInstance_Obj'))) {
        return reject({
          success: false,
          error_code: 400,
          message: 'Insufficient parameters',
          data: {}
        });
      }
      data['appointmentInstance'].update(data['updateAppointmentInstance_Obj'])
        .then(updateAppointmentInstance_Result => {
          log.info('---updateAppointmentInstance_Result---');
          log.info(updateAppointmentInstance_Result);
          if (updateAppointmentInstance_Result) {
            return resolve({
              success: true,
              message: 'Appointment details updated',
              data: {
                appointment_details: updateAppointmentInstance_Result
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
        .catch(updateAppointmentInstance_Error => {
          log.error('---updateAppointmentInstance_Error---');
          log.error(updateAppointmentInstance_Error);
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
