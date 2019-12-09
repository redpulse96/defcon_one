const log = require('../../config/log_config').logger('appointments_controller');
const AppointmentLogs = require(packageHelper.MODEL_CONFIG_DIR)['AppointmentLogs'];
const utils = require('../utility/utils');
const async = packageHelper.async;
const moment = packageHelper.moment;
const twilio = packageHelper.twilio;

module.exports = Appointments => {

  Appointments.createAppointment = (req, res) => {
    async.auto({
      validateData: validateDataFunction,
      checkPatientExistance: ['validateData', checkPatientExistanceFunction],
      createAppointment: ['validateData', 'checkPatientExistance', createAppointmentFunction],
      createAppointmentLog: ['createAppointment', createAppointmentLogFunction]
    })
    .then(async_auto_res => res.send(async_auto_res.createAppointment))
    .catch(async_auto_err => res.status(async_auto_err.error_code).send(async_auto_err));

    function validateDataFunction(callback) {
      let paramsCheck = {
        data: req.body,
        mandatoryParams: ['appointment_name', 'appointment_date', 'patient_id', 'appointment_status', 'from_time', 'to_time']
      }
      utils.hasMandatoryParams(paramsCheck)
        .then(res => callback(null, res))
        .catch(err => callback(err));
    }

    function checkPatientExistanceFunction(results, callback) {
      const { validateData } = results;
      let filterPatientObj = {
        where: {
          patient_id: validateData.data.patient_id
        }
      };
      models['Patients'].scope('activeScope').findOne(filterPatientObj)
      .then(patient_res => {
        log.info('---patient_res---');
        log.info(patient_res);
        if (patient_res) {
          return callback(null, {
            success: true,
            message: 'Patient exists',
            data: {
              patient_details: patient_res
            }
          });
        } else {
          return callback({
            success: false,
            error_code: 400,
            message: 'Patient does not exist',
            data: {}
          });
        }
      })
      .catch(patient_err => {
        log.error('---patient_err---');
        log.error(patient_err);
        return callback({
          success: false,
          error_code: 500,
          message: 'Patient does not exist',
          data: {}
        })
      });
    }

    function createAppointmentFunction(results, callback) {
      const { validateData } = results;
      const createObj = Object.assign({}, validateData.data, { created_by: req.user.username });
      createObj.appointment_date = moment(createObj.appointment_date).format('YYYY-MM-DD');
      createObj.from_time = moment(createObj.from_time).format('hh:mm:ss');
      createObj.to_time = moment(createObj.to_time).format('hh:mm:ss');
      // createObj.to_time = moment(createObj.to_time).format();

      models['Appointments'].create(createObj)
        .then(create_res => {
          log.info('---APPOINTMENTS_CREATION_SUCCESS---');
          log.info(create_res);
          return callback(null, {
            success: true,
            message: 'Appointment creation success',
            data: {
              appointment: create_res
            }
          });
        })
        .catch(create_err => {
          log.error('---APPOINTMENTS_CREATION_FAILURE---');
          log.error(create_err);
          return callback({
            success: false,
            error_code: 500,
            message: 'Appointment creation failure',
            data: {}
          });
        });
    }

    function createAppointmentLogFunction(results, callback) {
      const { validateData, createAppointment } = results;
      const logObj = Object.assign({}, {
        appointment_id: createAppointment.data.appointment.appointment_id,
        status: createAppointment.data.appointment.status
      }, validateData.data);
      AppointmentLogs.createAppointmentLogs(logObj)
        .then(log_res => callback(null, log_res))
        .catch(log_err => callback(log_err));
    }
  }
}