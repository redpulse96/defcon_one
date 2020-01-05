const log = require('../../config/log_config').logger('appointments_controller');
const AppointmentLogs = require(packageHelper.MODEL_CONFIG_DIR)['AppointmentLogs'];
const Patients = require(packageHelper.MODEL_CONFIG_DIR)['Patients'];
const moment = packageHelper.moment;
const utils = require('../utility/utils');
const {
  to
} = require('../utility/helper_function');
const {
  MANDATORY_PARAMS: {
    CREATE_APPOINTMENT
  }
} = require('../../public/javascripts/constants');

module.exports = Appointments => {

  Appointments.createAppointment = async (req, res) => {

    let [validateDataError, validateDataResult] = await to(validateDataFunction(req));
    if (validateDataError) {
      return utils.generateResponse(validateDataError)(res);
    }

    let checkPatientExistanceObj = {
      ...validateDataResult.data
    };
    let [checkPatientExistanceError] = await to(checkPatientExistanceFunction(checkPatientExistanceObj));
    if (checkPatientExistanceError) {
      return utils.generateResponse(checkPatientExistanceError)(res);
    }

    let createNewAppointmentObj = {
      ...validateDataResult.data
    };
    let [createNewAppointmentError, createNewAppointmentResult] = await to(createNewAppointmentFunction(createNewAppointmentObj));
    if (createNewAppointmentError) {
      return utils.generateResponse(createNewAppointmentError)(res);
    }

    let createNewAppointmentLogObj = {
      ...validateDataResult.data,
      ...createNewAppointmentResult.data.appointment.dataValues
    };
    let [createAppointmentLogError] = await to(createAppointmentLogFunction(createNewAppointmentLogObj));
    if (createAppointmentLogError) {
      return utils.generateResponse(createAppointmentLogError)(res);
    }
    return utils.generateResponse(createNewAppointmentResult)(res);
  }

  function validateDataFunction(data) {
    return new Promise((resolve, reject) => {
      let paramsCheck = {
        data: data.body,
        mandatoryParams: CREATE_APPOINTMENT
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

  function checkPatientExistanceFunction(data) {
    return new Promise((resolve, reject) => {
      let filterPatientObj = {
        filterScope: 'activeScope',
        methodName: 'findOne',
        patient_id: data.patient_id
      };
      Patients.fetchPatientsByFilter(filterPatientObj)
        .then(patientRes => {
          log.info('---patientRes---');
          log.info(patientRes);
          if (patientRes && patientRes.data && patientRes.data.patient_details) {
            return resolve(patientRes);
          } else {
            return reject(patientRes);
          }
        })
        .catch(patientErr => {
          log.error('---patientErr---');
          log.error(patientErr);
          return reject(patientErr);
        });
    });
  }

  function createNewAppointmentFunction(data) {
    return new Promise((resolve, reject) => {
      let createObj = {
        ...data,
        appointment_date: moment(data.appointment_date).format('YYYY-MM-DD'),
        from_time: moment(data.from_time, 'HH:mm:ss').format('HH:mm:ss'),
        to_time: moment(data.to_time, 'HH:mm:ss').format('HH:mm:ss'),
        created_by: data.user.username
      };
      Appointments.createAppointmentsInstance(createObj)
        .then(createRes => {
          return resolve(createRes);
        })
        .catch(createErr => {
          return reject(createErr);
        });
    });
  }

  function createAppointmentLogFunction(data) {
    return new Promise((resolve, reject) => {
      let logObj = {
        ...data
      };
      AppointmentLogs.createAppointmentLogs(logObj)
        .then(logRes => {
          return resolve(logRes);
        })
        .catch(logErr => {
          return reject(logErr);
        });
    });
  }
}
