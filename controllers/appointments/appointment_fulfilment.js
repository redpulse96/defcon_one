const log = require('../../config/log_config').logger('appointments_controller');
const AppointmentLogs = require(packageHelper.MODEL_CONFIG_DIR)['AppointmentLogs'];
const utils = require('../utility/utils');
const async = packageHelper.async;
const moment = packageHelper.moment;
const _ = packageHelper.lodash;

const status_matrix = {
  'pending': ['operating', 'rescheduled', 'closed'],
  'operating': ['closed', 'rescheduled'],
  'rescheduled': ['pending', 'closed'],
  'closed': []
};

module.exports = Appointments => {

  Appointments.appointmentFulfilment = (req, res) => {
    async.auto({
      validateData: validateDataFunction,
      fetchCurrentAppointment: ['validateData', fetchCurrentAppointmentFunction],
      checkStatusMatrix: ['fetchCurrentAppointment', checkStatusMatrixFunction],
      rescheduleAppointment: ['fetchCurrentAppointment', 'checkStatusMatrix', rescheduleAppointmentFunction],
      updateAppointmentStatus: ['checkStatusMatrix', 'rescheduleAppointment', updateAppointmentStatusFunction],
      createAppointmentLog: ['updateAppointmentStatus', createAppointmentLogFunction]
    })
    .then(async_auto_res => {
      log.info('---async_auto_res---');
      log.info(async_auto_res);
      return res.send(async_auto_res.fetchCurrentAppointment)
    })
    .catch(async_auto_err => {
      log.error('---async_auto_err---');
      log.error(async_auto_err);
      return res.status(async_auto_err.error_code).send(async_auto_err)
    });

    function validateDataFunction(callback) {
      let paramsCheck = {
        data: req.body,
        mandatoryParams: ['appointment_id', 'appointment_status']
      }
      utils.hasMandatoryParams(paramsCheck)
        .then(params_res => callback(null, params_res))
        .catch(params_err => callback(params_err));
    }

    function fetchCurrentAppointmentFunction(results, callback) {
      let whereObj = {
        where: {
          appointment_id: req.body.appointment_id,
          is_active: true,
          is_archived: false
        }
      };
      models['Appointments'].findOne(whereObj)
        .then(appointment_res => {
          appointment_res = appointment_res.toJSON();
          log.info('---APPOINTMENTS_FETCH_SUCCESS---');
          log.info(appointment_res);
          if (appointment_res) {
            return callback(null, {
              success: true,
              message: 'Appointments fetching success',
              data: {
                appointment_detail: appointment_res
              }
            });
          } else {
            return callback({
              success: false,
              error_code: 500,
              message: 'No appointment exists',
              data: {}
            });
          }
        })
        .catch(appointment_err => {
          log.info('---APPOINTMENTS_FETCH_FAILURE---');
          log.info(appointment_err);
          return callback({
            success: false,
            error_code: 500,
            message: 'Internal server error',
            data: {}
          });
        });
    }

    function checkStatusMatrixFunction(results, callback) {
      const { fetchCurrentAppointment } = results;
      log.info('---fetchCurrentAppointment---');
      log.info(fetchCurrentAppointment);
      let current_status = fetchCurrentAppointment.data.appointment_detail.appointment_status;
      if (status_matrix[current_status].indexOf(req.body.appointment_status) > -1) {
        return callback(null, {
          success: true,
          message: 'Can go to the current status',
          data: status_matrix[current_status]
        });
      } else {
        return callback({
          success: false,
          error_code: 400,
          message: 'The appointment cannot be moved to the given status',
          data: {}
        });
      }
    }

    function rescheduleAppointmentFunction(results, callback) {
      const { fetchCurrentAppointment, checkStatusMatrix } = results;
      if (req.body.appointment_status === 'rescheduled') {
        log.info('---APPOINTMENT_RESCHEDULING_REQUEST_RAISED---');
        if (!(_.has(req.body, 'rescheduled_date') || _.has(req.body, 'from_time') || _.has(req.body, 'to_time'))) {
          return callback({
            success: false,
            error_code: 400,
            message: 'Appointment rescheduled request raised,\nbut the required details have not been specified',
            data: {}
          });
        } else {
          let filter = {
            where: {
              rescheduled_date: req.body.rescheduled_date,
              $and: [{
                $or: [{
                  from_time: {
                    $gte: req.body.from_time
                  }
                }, {
                  from_time: {
                    $lte: req.body.from_time
                  }
                }],
              }, {
                $or: [{
                  to_time: {
                    $gte: req.body.to_time
                  }
                }, {
                  to_time: {
                    $lte: req.body.to_time
                  }
                }]
              }]
            }
          };
          models['Appointments'].findAll(filter)
            .then(appointment_date_res => {
              log.info('---appointment_date_res---');
              log.info(appointment_date_res);
              if(appointment_date_res && appointment_date_res.length) {
                return callback({
                  success: false,
                  error_code: 200,
                  message: 'There is already an appointment scheduled at the specified slot,\nkindly choose a different slot',
                  data: {}
                });
              } else {
                req.body.doctor_remarks = 'Appointment has been rescheduled to ' + req.body.rescheduled_date + ' at slot ' + req.body.from_time + ' to ' + req.body.to_time;
                req.body.appointment_date = moment(req.body.rescheduled_date).format('YYYY-MM-DD');
                req.body.rescheduled_date = moment(req.body.rescheduled_date).format('YYYY-MM-DD');
                req.body.from_time = moment(req.body.from_time).format('hh:mm:ss');
                req.body.to_time = moment(req.body.to_time).format('hh:mm:ss');
                return callback(null, { isRescheduled: true });
              }
            })
            .catch(appointment_date_err => {
              log.error('---appointment_date_err---');
              log.error(appointment_date_err);
              return callback({
                success: false,
                error_code: 500,
                message: 'Internal server error',
                data: {}
              });
            });
        }
      } else {
        return callback(null, { isRescheduled: false });
      }
    }

    function updateAppointmentStatusFunction(results, callback) {
      const { rescheduleAppointment, fetchCurrentAppointment } = results;
      let updateObj = { appointment_status: req.body.appointment_status };
      fetchCurrentAppointment.data.appointment_detail.appointment_status = req.body.appointment_status;
      if (rescheduleAppointment.isRescheduled) {
        Object.assign(updateObj, {
          appointment_date: req.body.rescheduled_date,
          rescheduled_date: req.body.rescheduled_date,
          from_time: req.body.from_time,
          to_time: req.body.to_time
        });
      }
      fetchCurrentAppointment.data.appointment_detail.update(updateObj)
        .then(update_appointment_res => {
          log.info('---update_appointment_res---');
          log.info(update_appointment_res);
          if (update_appointment_res) {
            return callback(null, {
              success: true,
              message: 'Appointment details updated',
              data: {
                appointment_details: update_appointment_res
              }
            });
          } else {
            return callback(null, {
              success: false,
              error_code: 500,
              message: 'Appointment details could not be updated',
              data: {}
            });
          }
        })
        .catch(update_appointment_err => {
          log.error('---update_appointment_err---');
          log.error(update_appointment_err);
          return callback({
            success: false,
            error_code: 500,
            message: 'Could not update the appointment',
            data: {}
          });
        });
    }

    function createAppointmentLogFunction(results, callback) {
      const { updateAppointmentStatus } = results;
      let createLogObj = {
        appointment_id: updateAppointmentStatus.data.appointment_details.appointment_id,
        appointment_status: updateAppointmentStatus.data.appointment_details.appointment_status,
        doctor_remarks: utils.validateKeys(() => req.body.doctor_remarks, null, null)
      };
      AppointmentLogs.createAppointmentLogs(createLogObj)
        .then(create_log_res => callback(null, create_log_res))
        .catch(create_log_err => callback(create_log_err));
    }
  }
}