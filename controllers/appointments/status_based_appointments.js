const log = require('../../config/log_config').logger('appointments_controller');
const utils = require('../utility/utils');
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
    let filter = Object.assign({}, {
      where: {
        created_by: {
          $in: [req.user.username]
        },
        assigned_to: req.user.username,
        appointment_date: utils.validateKeys(() => moment(req.params.custom_date).format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'), null)
      },
      include: [{
        model: models['AppointmentLogs'],
        as: 'appointment_logs'
      }],
      order: [
        ['appointment_date', 'ASC']
      ]
    });
    if (req.user.parent) {
      filter.where.created_by.$in.push(req.user.parent);
    }
    models['Appointments'].findAll(filter)
      .then(appointments_res => {
        let response;
        log.info('---APPOINTMENT_LIST---');
        log.info(appointments_res);
        if (appointments_res) {
          response = {
            success: true,
            error_code: 200,
            message: 'Appointments list fetch success',
            data: {
              appointments_list: _.groupBy(appointments_res, 'status')
            }
          };
        } else {
          response = {
            success: false,
            error_code: 400,
            message: 'No appointments exist for the selected date,\nKindly select a different date',
            data: {}
          };
        }
        res.status(error_code).send(response);
      })
      .catch(appointments_err => {
        log.info('---APPOINTMENT_LIST_ERROR---');
        log.info(appointments_err);
        res.status(500).send({
          success: false,
          message: 'Internal server error',
          data: {}
        });
      });
  }
}