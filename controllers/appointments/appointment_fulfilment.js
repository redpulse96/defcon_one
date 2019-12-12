const log = require('../../config/log_config').logger('appointments_controller');
const AppointmentLogs = require(packageHelper.MODEL_CONFIG_DIR)['AppointmentLogs'];
const utils = require('../utility/utils');
const async = packageHelper.async;
const moment = packageHelper.moment;
const _ = packageHelper.lodash;

const statusMatrix = {
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
      updateAppointmentStatus: ['fetchCurrentAppointment', 'rescheduleAppointment', updateAppointmentStatusFunction],
      createAppointmentLog: ['updateAppointmentStatus', createAppointmentLogFunction]
    })
    .then(asyncAutoRes => {
      log.info('---asyncAutoRes---');
      log.info(asyncAutoRes);
      return res.send(asyncAutoRes.fetchCurrentAppointment);
    })
    .catch(asyncAutoErr => {
      log.error('---asyncAutoErr---');
      log.error(asyncAutoErr);
      return res.status(asyncAutoErr.error_code).send(asyncAutoErr);
    });

    function validateDataFunction(callback) {
      let paramsCheck = {
        data: req.body,
        mandatoryParams: ['appointment_id', 'appointment_status']
      }
      utils.hasMandatoryParams(paramsCheck)
        .then(paramsRes => callback(null, paramsRes))
        .catch(paramsErr => callback(paramsErr));
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
        .then(appointmentRes => {
          log.info('---APPOINTMENTS_FETCH_SUCCESS---');
          log.info(appointmentRes);
          if (appointmentRes) {
            return callback(null, {
              success: true,
              message: 'Appointments fetching success',
              data: {
                appointment_detail: appointmentRes
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
        .catch(appointmentErr => {
          log.info('---APPOINTMENTS_FETCH_FAILURE---');
          log.info(appointmentErr);
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
      let currentStatus = fetchCurrentAppointment.data.appointment_detail.appointment_status;
      if (statusMatrix[currentStatus].indexOf(req.body.appointment_status) > -1) {
        return callback(null, {
          success: true,
          message: 'Can go to the current status',
          data: statusMatrix[currentStatus]
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
      if (req.body.appointment_status === 'rescheduled') {
        log.info('---APPOINTMENTResCHEDULING_REQUEST_RAISED---');
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
          models['Appointments'].scope('activeScope').findAll(filter)
            .then(appointmentDataRes => {
              log.info('---appointment_dateRes---');
              log.info(appointmentDataRes);
              if(appointmentDataRes && appointmentDataRes.length) {
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
            .catch(appointmentDataErr => {
              log.error('---appointment_data_err---');
              log.error(appointmentDataErr);
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
        .then(updateAppointmentRes => {
          log.info('---update_appointmentRes---');
          log.info(updateAppointmentRes);
          if (updateAppointmentRes) {
            return callback(null, {
              success: true,
              message: 'Appointment details updated',
              data: {
                appointment_details: updateAppointmentRes
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
        .catch(updateAppointmentErr => {
          log.error('---update_appointment_err---');
          log.error(updateAppointmentErr);
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
        .then(createLogRes => callback(null, createLogRes))
        .catch(createLogErr => callback(createLogErr));
    }
  }
}