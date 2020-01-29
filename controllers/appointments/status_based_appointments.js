const log = require('../../config/log_config').logger('appointments_controller');
const utils = require('../utility/utils');
const moment = packageHelper.moment;
const {
  arrayFn
} = require('../utility/helper_function');

module.exports = Appointments => {

  Appointments.statusBasedAppointments = (req, res) => {
    if (!req.params) {
      return res.send({
        success: false,
        message: 'Insufficient parameters',
        data: {}
      });
    }
    let [fromDate, toDate] = [utils.validateKeys(() => moment(req.params.custom_from_date).format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'), null), utils.validateKeys(() => moment(req.params.custom_to_date).format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'), null)];
    let filter = {
      where: {
        $or: [{
          assigned_to: req.user.username,
          appointment_date: {
            in: [fromDate, toDate]
          }
        }, {
          created_by: {
            $in: [req.user.username]
          },
          appointment_date: {
            $in: [fromDate, toDate]
          }
        }]
      },
      include: [{
        model: models['AppointmentLogs'],
        as: 'appointment_logs'
      }],
      order: [
        ['appointment_date', 'ASC']
      ]
    };
    if (req.user.parent) {
      filter.where.created_by.$in.push(req.user.parent);
    }
    models['Appointments']
      .scope('activeScope')
      .findAll(filter)
      .then(appointmentsRes => {
        let response;
        log.info('---APPOINTMENT_LIST---');
        log.info(appointmentsRes);
        if (appointmentsRes) {
          response = {
            success: true,
            http_code: 200,
            message: 'Appointments list fetch success',
            data: {
              appointments_list: arrayFn.groupBy(appointmentsRes, 'appointment_status')
            }
          };
        } else {
          response = {
            success: false,
            http_code: 400,
            message: 'No appointments exist for the selected date,\nKindly select a different date',
            data: {}
          };
        }
        res.status(response.http_code).send(response);
      })
      .catch(appointmentsErr => {
        log.info('---APPOINTMENT_LIST_ERROR---');
        log.info(appointmentsErr);
        return res.status(500).send({
          success: false,
          message: 'Internal server error',
          data: {}
        });
      });
  }
}
