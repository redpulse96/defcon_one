const log = require('../../config/log_config').logger('appointments_helper');
const moment = packageHelper.moment;
const {
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
   * @param {Date} data.rescheduled_date Re-scheduled date of the appointment, is `NULL` while creating
   * @param {Timestamp} data.from_time From time of the scheduled appointment
   * @param {Timestamp} data.to_time To time of the scheduled appointment
   */
  Appointments.createAppointmentsInstance = data => {
    return new Promise((resolve, reject) => {
      let noCreate = false;
      let createObj = {};
      data.appointment_name ? createObj.appointment_name = data.appointment_name : noCreate = true;
      data.appointment_date ? createObj.appointment_date = data.appointment_date : noCreate = true;
      data.patient_id ? createObj.patient_id = data.patient_id : noCreate = true;
      data.appointment_status ? createObj.appointment_status = data.appointment_status : createObj.appointment_status = APPOINTMENT_STATUS.PENDING;
      data.rescheduled_date ? createObj.rescheduled_date = data.rescheduled_date : createObj.rescheduled_date = null;
      data.from_time ? createObj.from_time = data.from_time : noCreate = true;
      data.to_time ? createObj.to_time = data.to_time : noCreate = true;
      data.doctor_remarks ? createObj.doctor_remarks = data.doctor_remarks : createObj.doctor_remarks = '';

      if (noCreate) {
        return reject({
          success: false,
          error_code: 500,
          message: 'Internal server error',
          data: {}
        });
      }
      models['Appointments'].create(createObj)
        .then(createRes => {
          log.info('---APPOINTMENTS_CREATION_SUCCESS---');
          log.info(createRes);
          return resolve({
            success: true,
            message: 'Appointment creation success',
            data: {
              appointment: createRes
            }
          });
        })
        .catch(createErr => {
          log.error('---APPOINTMENTS_CREATION_FAILURE---');
          log.error(createErr);
          return reject({
            success: false,
            error_code: 500,
            message: 'Appointment creation failure',
            data: {}
          })
        });
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
          to_time: data.to_time ? moment(data.to_time, 'HH:mm:ss').format('HH:mm:ss') : null
        }
      };
      !(data.filter_scope) ? data.filter_scope = 'defaultScope': null;
      filter.where = objectFn.compact(filter.where);
      models['Appointments'].scope(data.filter_scope).findAll(filter)
        .then(createRes => {
          log.info('---APPOINTMENTS_FETCH_SUCCESS---');
          log.info(createRes);
          return resolve({
            success: true,
            message: 'Appointment fetch success',
            data: {
              appointment: createRes
            }
          });
        })
        .catch(createErr => {
          log.error('---APPOINTMENTS_FETCH_FAILURE---');
          log.error(createErr);
          return reject({
            success: false,
            error_code: 500,
            message: 'Appointment fetch failure',
            data: {}
          })
        });
    });
  }
}
