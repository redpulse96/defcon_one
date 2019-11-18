const log = require('../../../config/log_config').logger('appointment_logs_controller');
const AppointmentLogs = require(packageHelper.MODEL_CONFIG_DIR)['AppointmentLogs'];

AppointmentLogs.fetchAppointmentLogs = (req, res) => {

  let whereObj = Object.assign({}, req.params);
  models.AppointmentLogs.findAll(whereObj)
    .then(fetch_res => {
      log.info('---appointment_logs_FETCH_SUCCESS---');
      log.info(fetch_res);
      return res.send({
        success: true,
        message: 'AppointmentLogs fetching success',
        data: {
          symptom: fetch_res
        }
      });
    })
    .catch(fetch_err => {
      log.info('---appointment_logs_FETCH_FAILURE---');
      log.info(fetch_err);
      return res.send({
        success: false,
        message: 'AppointmentLogs fetching failure',
        data: {
          symptom: fetch_err
        }
      });
    });
}

AppointmentLogs.createAppointmentLogs = (req, res) => {

  let createObj = Object.assign({}, req.body);
  models.AppointmentLogs.create(createObj)
    .then(create_res => {
      log.info('---appointment_logs_CREATION_SUCCESS---');
      log.info(create_res);
      return res.send({
        success: true,
        message: 'AppointmentLogs creation success',
        data: {
          symptom: create_res
        }
      });
    })
    .catch(create_err => {
      log.info('---appointment_logs_CREATION_FAILURE---');
      log.info(create_err);
      return res.send({
        success: false,
        message: 'AppointmentLogs creation failure',
        data: {
          symptom: create_err
        }
      });
    });
}

module.exports = AppointmentLogs;