const log = require('../../config/log_config').logger('appointments_controller');
const Appointments = require(packageHelper.MODEL_CONFIG_DIR)['Appointments'];
const AppointmentLogs = require(packageHelper.MODEL_CONFIG_DIR)['AppointmentLogs'];
const utils = require('../utility/utils');

const _ = packageHelper.lodash;
const async = packageHelper.async;
const moment = packageHelper.moment;

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

  validateData = callback => {
    let paramsCheck = {
      data: req.body,
      mandatoryParams: ['appointment_name', 'appointment_date', 'patient_id', 'status', 'created_by']
    }
    utils.hasMandatoryParams(paramsCheck)
      .then(res => callback(null, res))
      .catch(err => callback(err));
  }

  createAppointmentFunction = (results, callback) => {
    const {
      validateData
    } = results;
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

  createAppointmentLogFunction = (results, callback) => {
    const { validateData, createAppointment } = results;
    const logObj = Object.assign({}, {
      appointment_id: createAppointment.data.appointment.appointment_id,
      status: createAppointment.data.appointment.status
    }, validateData.data);
    AppointmentLogs.createAppointmentLogs(logObj)
      .then(log_res => callback(null, log_res))
      .catch(log_err => callback(log_err));
  }

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
          createAppointment: result.createAppointment,
          createAppointmentLog: result.createAppointmentLog
        }
      });
    })
    .catch(err => {
      log.error('---ERROR---');
      log.error(err);
      res.status(err.error_code).send(err);
    });
}

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
    order: [
      ['appointment_date', 'ASC']
    ]
  });
  models['Appointments'].findAll(filter)
    .then(appointments_res => {
      log.info('---APPOINTMENT_LIST---');
      log.info(appointments_res);
      let response = Object.keys(_.groupBy(appointments_res, 'status')).length ? _.groupBy(appointments_res, 'status') : [];
      res.send({
        success: true,
        message: 'Appointments list fetch success',
        data: {
          appointments_list: response
        }
      });
    })
    .catch(appointments_err => {
      log.info('---APPOINTMENT_LIST_ERROR---');
      log.info(appointments_err);
      res.send({
        success: false,
        message: 'Appointments list fetch failure',
        data: {}
      });
    });
}

module.exports = Appointments;
