const log = require('../../config/log_config').logger('appointments_controller');
const AppointmentLogs = require(packageHelper.MODEL_CONFIG_DIR)['AppointmentLogs'];
const utils = require('../utility/utils');
const async = packageHelper.async;
const moment = packageHelper.moment;
const {
  to
} = require('../utility/helper_function');

module.exports = Appointments => {

  Appointments.createAppointment = async (req, res) => {

    let [validateDataError, validateDataResult] = await to(validateDataFunction(req));
    log.info('---validateDataError---');
    log.info(validateDataError);
    log.info('---validateDataResult---');
    log.info(validateDataResult);

    if (validateDataError) {
      return res.status(validateDataError.error_code || 500).send(validateDataError);
    }

    let checkPatientExistanceObj = {
      ...validateDataResult.data
    };
    let [checkPatientExistanceError, checkPatientExistanceResult] = await to(checkPatientExistanceFunction(checkPatientExistanceObj));
    log.info('---checkPatientExistanceError---');
    log.info(checkPatientExistanceError);
    log.info('---checkPatientExistanceResult---');
    log.info(checkPatientExistanceResult);

    if (checkPatientExistanceError) {
      return res.status(checkPatientExistanceError.error_code || 500).send(checkPatientExistanceError);
    }

    let createNewAppointmentObj = {
      ...validateDataResult.data
    };
    let [createNewAppointmentError, createNewAppointmentResult] = await to(createNewAppointmentFunction(createNewAppointmentObj));
    log.info('---createNewAppointmentError---');
    log.info(createNewAppointmentError);
    log.info('---createNewAppointmentResult---');
    log.info(createNewAppointmentResult);

    if (createNewAppointmentError) {
      return res.status(createNewAppointmentError.error_code || 500).send(createNewAppointmentError);
    }

    let createNewAppointmentLogObj = {
      ...validateDataResult.data,
      ...createNewAppointmentResult.data.appointment
    };
    let [createAppointmentLogError, createAppointmentLogResult] = await to(createAppointmentLogFunction(createNewAppointmentLogObj));
    log.info('---createAppointmentLogError---');
    log.info(createAppointmentLogError);
    log.info('---createAppointmentLogResult---');
    log.info(createAppointmentLogResult);

    if (createAppointmentLogError) {
      return res.status(createAppointmentLogError.error_code || 500).send(createAppointmentLogError);
    }
    res.send(createNewAppointmentResult);
  }

  const validateDataFunction = data => {
    return new Promise((resolve, reject) => {
      let paramsCheck = {
        data: data.body,
        mandatoryParams: ['appointment_name', 'appointment_date', 'patient_id', 'appointment_status', 'from_time', 'to_time']
      }
      utils.hasMandatoryParams(paramsCheck)
        .then(paramRes => {
          paramRes.data.user = data.user;
          resolve(paramRes);
        })
        .catch(paramErr => {
          reject(paramErr);
        });
    });
  }

  const checkPatientExistanceFunction = data => {
    return new Promise((resolve, reject) => {
      let filterPatientObj = {
        where: {
          patient_id: data.patient_id
        }
      };
      models['Patients']
        .scope('activeScope')
        .findOne(filterPatientObj)
        .then(patientRes => {
          log.info('---patientRes---');
          log.info(patientRes);
          if (patientRes) {
            return resolve({
              success: true,
              message: 'Patient exists',
              data: {
                patient_details: patientRes
              }
            });
          } else {
            return reject({
              success: false,
              error_code: 400,
              message: 'Patient does not exist',
              data: {}
            });
          }
        })
        .catch(patientErr => {
          log.error('---patientErr---');
          log.error(patientErr);
          return reject({
            success: false,
            error_code: 500,
            message: 'Patient does not exist',
            data: {}
          })
        });
    });
  }

  const createNewAppointmentFunction = data => {
    return new Promise((resolve, reject) => {
      let createObj = {
        ...data,
        appointment_date: moment(data.appointment_date).format('YYYY-MM-DD'),
        from_time: moment(data.from_time, 'HH:mm:ss').format('HH:mm:ss'),
        to_time: moment(data.to_time, 'HH:mm:ss').format('HH:mm:ss'),
        created_by: data.user.username
      };
      models['Appointments']
        .create(createObj)
        .then(createRes => {
          log.info('---APPOINTMENTS_CREATION_SUCCESS---');
          log.info(createRes);
          return resolve({
            success: true,
            message: 'Appointment creation success',
            data: {
              appointment: createRes.toJSON()
            }
          });
        })
        .catch(createErr => {
          log.error('---APPOINTMENTS_CREATION_FAILURE---');
          log.error(createErr);
          return reject({
            success: false,
            error_code: 500,
            message: 'Appointment creation failure',
            data: {}
          });
        });
    });
  }

  const createAppointmentLogFunction = data => {
    return new Promise((resolve, reject) => {
      let logObj = {
        ...data
      };
      AppointmentLogs.createAppointmentLogs(logObj)
        .then(logRes => resolve(logRes))
        .catch(logErr => reject(logErr));
    });
  }
}