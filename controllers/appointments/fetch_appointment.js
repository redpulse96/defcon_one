const log = require('../../config/log_config').logger('appointments_controller');

module.exports = Appointments => {

  Appointments.fetchAppointment = (req, res) => {

    let whereObj = Object.assign({}, req.params);
    
  }
}