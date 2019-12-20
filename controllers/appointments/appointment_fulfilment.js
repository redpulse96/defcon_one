const log = require('../../config/log_config').logger('appointments_controller');
const AppointmentLogs = require(packageHelper.MODEL_CONFIG_DIR)['AppointmentLogs'];
const utils = require('../utility/utils');
const async = packageHelper.async;
const moment = packageHelper.moment;
const _ = packageHelper.lodash;
const {
  APPOINTMENT_STATUS_MATRIX
} = require('../../public/javascripts/constants');

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
        .then(paramsRes => {
          return callback(null, paramsRes);
        })
        .catch(paramsErr => {
          return callback(paramsErr);
        });
    }
  }

  const fetchCurrentAppointmentFunction = (result, callback) => {
    const {
      validateData
    } = result;
    let whereObj = {
      where: {
        appointment_id: validateData.data.appointment_id,
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

  const checkStatusMatrixFunction = (result, callback) => {
    const {
      validateData,
      fetchCurrentAppointment
    } = result;
    const statusMatrix = APPOINTMENT_STATUS_MATRIX;
    log.info('---fetchCurrentAppointment---');
    log.info(fetchCurrentAppointment);
    let currentStatus = fetchCurrentAppointment.data.appointment_detail.appointment_status;
    if (statusMatrix[currentStatus].indexOf(validateData.data.appointment_status) > -1) {
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

  const rescheduleAppointmentFunction = (result, callback) => {
    const {
      validateData
    } = result;
    if (validateData.data.appointment_status === 'rescheduled') {
      log.info('---APPOINTMENTResCHEDULING_REQUEST_RAISED---');
      if (!(_.has(validateData.data, 'rescheduled_date') || _.has(validateData.data, 'from_time') || _.has(validateData.data, 'to_time'))) {
        return callback({
          success: false,
          error_code: 400,
          message: 'Appointment rescheduled request raised,\nbut the required details have not been specified',
          data: {}
        });
      } else {
        let filter = {
          where: {
            rescheduled_date: validateData.data.rescheduled_date,
            $and: [{
              $or: [{
                from_time: {
                  $gte: validateData.data.from_time
                }
              }, {
                from_time: {
                  $lte: validateData.data.from_time
                }
              }],
            }, {
              $or: [{
                to_time: {
                  $gte: validateData.data.to_time
                }
              }, {
                to_time: {
                  $lte: validateData.data.to_time
                }
              }]
            }]
          }
        };
        models['Appointments'].scope('activeScope').findAll(filter)
          .then(appointmentDataRes => {
            log.info('---appointment_dateRes---');
            log.info(appointmentDataRes);
            if (appointmentDataRes && appointmentDataRes.length) {
              return callback({
                success: false,
                error_code: 200,
                message: 'There is already an appointment scheduled at the specified slot,\nkindly choose a different slot',
                data: {}
              });
            } else {
              validateData.data.doctor_remarks = 'Appointment has been rescheduled to ' + validateData.data.rescheduled_date + ' at slot ' + validateData.data.from_time + ' to ' + validateData.data.to_time;
              validateData.data.appointment_date = moment(validateData.data.rescheduled_date).format('YYYY-MM-DD');
              validateData.data.rescheduled_date = moment(validateData.data.rescheduled_date).format('YYYY-MM-DD');
              validateData.data.from_time = moment(validateData.data.from_time).format('hh:mm:ss');
              validateData.data.to_time = moment(validateData.data.to_time).format('hh:mm:ss');
              return callback(null, {
                isRescheduled: true
              });
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
      return callback(null, {
        isRescheduled: false
      });
    }
  }

  const updateAppointmentStatusFunction = (result, callback) => {
    const {
      validateData,
      rescheduleAppointment,
      fetchCurrentAppointment
    } = result;
    let updateObj = {
      appointment_status: validateData.data.appointment_status
    };
    fetchCurrentAppointment.data.appointment_detail.appointment_status = validateData.data.appointment_status;
    if (rescheduleAppointment.isRescheduled) {
      updateObj = {
        updateObj,
        appointment_date: validateData.data.rescheduled_date,
        rescheduled_date: validateData.data.rescheduled_date,
        from_time: validateData.data.from_time,
        to_time: validateData.data.to_time
      };
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

  const createAppointmentLogFunction = (result, callback) => {
    const {
      validateData,
      updateAppointmentStatus
    } = result;
    let createLogObj = {
      appointment_id: updateAppointmentStatus.data.appointment_details.appointment_id,
      appointment_status: updateAppointmentStatus.data.appointment_details.appointment_status,
      doctor_remarks: utils.validateKeys(() => validateData.data.doctor_remarks, null, null)
    };
    AppointmentLogs.createAppointmentLogs(createLogObj)
      .then(createLogRes => callback(null, createLogRes))
      .catch(createLogErr => callback(createLogErr));
  }
}
