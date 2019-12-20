const log = require('../../config/log_config').logger('appointments_controller');
const AppointmentLogs = require(packageHelper.MODEL_CONFIG_DIR)['AppointmentLogs'];
const utils = require('../utility/utils');
const async = packageHelper.async;
const moment = packageHelper.moment;

module.exports = Appointments => {

  Appointments.createAppointment = (req, res) => {
    async.auto({
      validateData: validateDataFunction,
      checkPatientExistance: ['validateData', checkPatientExistanceFunction],
      createNewAppointment: ['validateData', 'checkPatientExistance', createNewAppointmentFunction],
      createAppointmentLog: ['createNewAppointment', createAppointmentLogFunction]
    })
    .then(asyncAutoRes => {
      res.send(asyncAutoRes.createNewAppointment);
    })
    .catch(asyncAutoErr => {
      res.status(asyncAutoErr.error_code).send(asyncAutoErr);
    });

    function validateDataFunction(callback) {
      let paramsCheck = {
        data: req.body,
        mandatoryParams: ['appointment_name', 'appointment_date', 'patient_id', 'appointment_status', 'from_time', 'to_time']
      }
      utils.hasMandatoryParams(paramsCheck)
        .then(paramRes => {
          paramRes.data.user = req.user;
          callback(null, paramRes);
        })
        .catch(paramErr => {
          callback(paramErr);
        });
    }
  }

  const checkPatientExistanceFunction = (result, callback) => {
    const {
      validateData
    } = result;
    let filterPatientObj = {
      where: {
        patient_id: validateData.data.patient_id
      }
    };
    models['Patients'].scope('activeScope').findOne(filterPatientObj)
      .then(patientRes => {
        log.info('---patientRes---');
        log.info(patientRes);
        if (patientRes) {
          return callback(null, {
            success: true,
            message: 'Patient exists',
            data: {
              patient_details: patientRes
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
      .catch(patientErr => {
        log.error('---patientErr---');
        log.error(patientErr);
        return callback({
          success: false,
          error_code: 500,
          message: 'Patient does not exist',
          data: {}
        })
      });
  }

  const createNewAppointmentFunction = (result, callback) => {
    const {
      validateData
    } = result;
    const createObj = {
      ...validateData.data.user.username
    };
    createObj.appointment_date = moment(createObj.appointment_date).format('YYYY-MM-DD');
    createObj.from_time = moment(createObj.from_time).format('hh:mm:ss');
    createObj.to_time = moment(createObj.to_time).format('hh:mm:ss');

    models['Appointments'].create(createObj)
      .then(createRes => {
        log.info('---APPOINTMENTS_CREATION_SUCCESS---');
        log.info(createRes);
        return callback(null, {
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
        return callback({
          success: false,
          error_code: 500,
          message: 'Appointment creation failure',
          data: {}
        });
      });
  }

  const createAppointmentLogFunction = (result, callback) => {
    const {
      validateData,
      createNewAppointment
    } = result;
    let logObj = {
      appointment_id: createNewAppointment.data.appointment.appointment_id,
      status: createNewAppointment.data.appointment.status,
      ...validateData.data
    };
    AppointmentLogs.createAppointmentLogs(logObj)
      .then(logRes => callback(null, logRes))
      .catch(logErr => callback(logErr));
  }
}