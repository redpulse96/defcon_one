const log = require('../../../config/components/log_config').logger('appointments_log_controller');
const AppointmentsLog = require(packageHelper.MODEL_CONFIG_DIR)['AppointmentsLog'];

AppointmentsLog.fetchAppointmentsLog = (req, res) => {

  let whereObj = Object.assign({}, req.params);
  models.AppointmentsLog.findAll(whereObj)
    .then(fetch_res => {
      log.info('---APPOINTMENTS_LOG_FETCH_SUCCESS---');
      log.info(fetch_res);
      return res.send({
        success: true,
        message: 'AppointmentsLog fetching success',
        data: {
          symptom: fetch_res
        }
      });
    })
    .catch(fetch_err => {
      log.info('---APPOINTMENTS_LOG_FETCH_FAILURE---');
      log.info(fetch_err);
      return res.send({
        success: false,
        message: 'AppointmentsLog fetching failure',
        data: {
          symptom: fetch_err
        }
      });
    });
}

AppointmentsLog.createAppointmentsLog = (req, res) => {

  let createObj = Object.assign({}, req.body);
  models.AppointmentsLog.create(createObj)
    .then(create_res => {
      log.info('---APPOINTMENTS_LOG_CREATION_SUCCESS---');
      log.info(create_res);
      return res.send({
        success: true,
        message: 'AppointmentsLog creation success',
        data: {
          symptom: create_res
        }
      });
    })
    .catch(create_err => {
      log.info('---APPOINTMENTS_LOG_CREATION_FAILURE---');
      log.info(create_err);
      return res.send({
        success: false,
        message: 'AppointmentsLog creation failure',
        data: {
          symptom: create_err
        }
      });
    });
}

module.exports = AppointmentsLog;