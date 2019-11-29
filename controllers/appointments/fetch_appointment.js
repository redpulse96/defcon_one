const log = require('../../config/log_config').logger('appointments_controller');

module.exports = Appointments => {

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
}