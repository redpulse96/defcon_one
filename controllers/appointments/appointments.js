const log = require('../../../config/components/log_config').logger('appointments_controller');
const Appointments = require(packageHelper.MODEL_CONFIG_DIR)['Appointments'];

Appointments.fetchAppointment = (req, res) => {

  let whereObj = Object.assign({}, req.params);
  models.Appointments.findAll(whereObj)
    .then(fetch_res => {
      log.info('---APPOINTMENTS_FETCH_SUCCESS---');
      log.info(fetch_res);
      return res.send({
        success: true,
        message: 'Appointments fetching success',
        data: {
          symptom: fetch_res
        }
      });
    })
    .catch(fetch_err => {
      log.info('---APPOINTMENTS_FETCH_FAILURE---');
      log.info(fetch_err);
      return res.send({
        success: false,
        message: 'Appointments fetching failure',
        data: {
          symptom: fetch_err
        }
      });
    });
}

Appointments.createAppointment = (req, res) => {

  let createObj = Object.assign({}, req.body);
  models.Appointments.create(createObj)
    .then(create_res => {
      log.info('---APPOINTMENTS_CREATION_SUCCESS---');
      log.info(create_res);
      return res.send({
        success: true,
        message: 'Appointment creation success',
        data: {
          symptom: create_res
        }
      });
    })
    .catch(create_err => {
      log.info('---APPOINTMENTS_CREATION_FAILURE---');
      log.info(create_err);
      return res.send({
        success: false,
        message: 'Appointment creation failure',
        data: {
          symptom: create_err
        }
      });
    });
}

module.exports = Appointments;