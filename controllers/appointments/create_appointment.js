const log = require('../../config/log_config').logger('appointments_controller');
const AppointmentLogs = require(packageHelper.MODEL_CONFIG_DIR)['AppointmentLogs'];
const async = packageHelper.async;
const moment = packageHelper.moment;

module.exports = Appointments => {

  Appointments.createAppointment = (req, res) => {
    async.auto({
      validateData: validateData,
      createAppointment: ['validateData', createAppointmentFunction],
      createAppointmentLog: ['createAppointment', createAppointmentLogFunction]
    })
    .then(result => {
      log.info('---RESULT---');
      log.info(result);
      res.send({
        success: true,
        message: 'appointment created',
        data: {
          createAppointment: result.createAppointment
        }
      });
    })
    .catch(err => {
      log.error('---ERROR---');
      log.error(err);
      res.status(err.error_code).send(err);
    });

    validateData = callback => {
      let paramsCheck = {
        data: req.body,
        mandatoryParams: ['appointment_name', 'appointment_date', 'patient_id', 'status', 'created_by']
      }
      utils.hasMandatoryParams(paramsCheck)
        .then(res => callback(null, res))
        .catch(err => callback(err));
    }

    const createAppointmentFunction = (results, callback) => {
      const { validateData } = results;
      const createObj = Object.assign({}, validateData.data);
      createObj.appointment_date = moment(createObj.appointment_date).format('YYYY MM DD hh:mm:ss');
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

    const createAppointmentLogFunction = (results, callback) => {
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