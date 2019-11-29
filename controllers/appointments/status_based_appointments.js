const log = require('../../config/log_config').logger('appointments_controller');
const _ = packageHelper.lodash;
const moment = packageHelper.moment;

module.exports = Appointments => {

  Appointments.statusBasedAppointments = (req, res) => {

    if (!req.params) {
      return res.send({
        success: false,
        message: 'Insufficient parameters',
        data: {}
      });
    }
    let currentDate = req.params.custom_date ? moment(req.params.custom_date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
    let filter = Object.assign({}, {
      where: {
        created_by: req.params.user_id,
        appointment_date: currentDate
      },
      include: [{
        model: models['AppointmentLogs'],
        as: 'appointment_logs'
      }],
      
      order: [
        ['appointment_date', 'ASC']
      ]
    });
    models['Appointments'].findAll(filter)
      .then(appointments_res => {
        let response;
        log.info('---APPOINTMENT_LIST---');
        log.info(appointments_res);
        if (appointments_res) {
          response = {
            success: true,
            message: 'Appointments list fetch success',
            data: {
              appointments_list: _.groupBy(appointments_res, 'status')
            }
          };
        } else {
          response = {
            success: false,
            message: 'No appointments exist for the selected date,\nKindly select a different date',
            data: {}
          };
        }
        res.send(response);
      })
      .catch(appointments_err => {
        log.info('---APPOINTMENT_LIST_ERROR---');
        log.info(appointments_err);
        res.status(500).send({
          success: false,
          message: 'Appointments list fetch failure',
          data: {}
        });
      });
  }
}