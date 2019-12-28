const log = require('../../../config/log_config').logger('appointment_logs_controller');
const AppointmentLogs = require(packageHelper.MODEL_CONFIG_DIR)['AppointmentLogs'];

AppointmentLogs.fetchAppointmentLogs = (req, res) => {

  let whereObj = {
    ...req.params
  };
  models['AppointmentLogs'].findAll(whereObj)
    .then(fetchRes => {
      log.info('---appointment_logs_FETCH_SUCCESS---');
      log.info(fetchRes);
      return res.send({
        success: true,
        message: 'AppointmentLogs fetching success',
        data: {
          appointment_log: fetchRes
        }
      });
    })
    .catch(fetchErr => {
      log.info('---appointment_logs_FETCH_FAILURE---');
      log.info(fetchErr);
      return res.status(500).send({
        success: false,
        message: 'AppointmentLogs fetching failure',
        data: {}
      });
    });
}

AppointmentLogs.createAppointmentLogs = data => {

  return new Promise((resolve, reject) => {
    let createObj = { ...data };
    models['AppointmentLogs'].create(createObj)
      .then(createRes => {
        log.info('---appointment_logs_CREATION_SUCCESS---');
        log.info(createRes);
        return resolve({
          success: true,
          message: 'AppointmentLogs creation success',
          data: {
            appointment_log: createRes
          }
        });
      })
      .catch(createErr => {
        log.info('---appointment_logs_CREATION_FAILURE---');
        log.info(createErr);
        return reject({
          success: false,
          error_code: 500,
          message: 'AppointmentLogs creation failure',
          data: {}
        });
      });
  });
}

module.exports = AppointmentLogs;
