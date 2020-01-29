const log = require('../../config/log_config').logger('patients_helper');
const moment = packageHelper.moment;
const {
  arrayFn,
  objectFn
} = require('../utility/helper_function');

module.exports = Patients => {
  /**
   * @param {Object[]} data - Object with the details to create patient
   * @param {Number} data.mobile_no Mobile number of the patient to be created
   * @param {String} data.patient_name Name of the patient to be created
   * @param {Number} data.age Age of the patient to be created
   * @param {String} data.gender Gender of the patient to be created
   * @param {Number} data.height Height of the patient to be created
   * @param {Number} data.weight weight of the patient to be created
   * @param {String} data.blood_type Blood type of the patient to be created
   * @param {Date} data.date_of_birth Date of birth of the patient
   * @param {String} data.email Email of the patient
   * @param {String} data.created_by Email of the user that created the patient
   */
  Patients.createPatientsInstance = data => {
    return new Promise((resolve, reject) => {
      let noCreate = false;
      let createObj = {
        mobile_no: data.mobile_no ? data.mobile_no : null && (noCreate = true),
        patient_name: data.patient_name ? data.patient_name : null && (noCreate = true),
        blood_type: data.blood_type ? data.blood_type : null && (noCreate = true),
        date_of_birth: data.date_of_birth ? data.date_of_birth : null && (noCreate = true),
        gender: data.gender ? data.gender : null && (noCreate = true),
        created_by: data.created_by ? data.created_by : null && (noCreate = true),
        age: data.age ? data.age : null && (noCreate = true),
        height: data.height ? data.height : null,
        weight: data.weight ? data.weight : null,
        email: data.email ? data.email : null
      }
      if (noCreate) {
        return reject({
          success: false,
          error_code: 500,
          message: 'Internal server error',
          data: {}
        });
      }
      createObj = objectFn.compact(createObj);
      try {
        models['Patients'].create(createObj)
          .then(createPatientRes => {
            log.info('---PATIENTS_CREATION_SUCCESS---');
            log.info(createPatientRes);
            return resolve({
              success: true,
              message: 'Patients creation success',
              data: {
                patient_details: createPatientRes
              }
            });
          })
          .catch(createPatientErr => {
            log.error('---PATIENTS_CREATION_FAILURE---');
            log.error(createPatientErr);
            return reject({
              success: false,
              error_code: 500,
              message: 'Patients creation failure',
              data: {}
            });
          });
      } catch (error) {
        log.error('---ERROR_CAUGHT---');
        log.error(error);
        return reject({
          success: false,
          error_code: 500,
          message: 'Internal server error',
          data: {}
        });
      }
    });
  }

  /**
   * @param {Object[]} data - Objects with the details to fetch patients and their details
   * @param {Array} data.patient_ids Array of patient ids
   * @param {Number} data.patient_id Patient id of the patient
   * @param {Array} data.mobile_nos Array of mobile of the patients
   * @param {Number} data.mobile_no Mobile number of the patient to be created
   * @param {String} data.patient_name Name of the patient to be created
   * @param {Number} data.age Age of the patient to be created
   * @param {String} data.gender Gender of the patient to be created
   * @param {Number} data.height Height of the patient to be created
   * @param {Number} data.weight weight of the patient to be created
   * @param {String} data.blood_type Blood type of the patient to be created
   * @param {Date} data.date_of_birth Date of birth of the patient
   * @param {String} data.email Email of the patient
   * @param {String} data.created_by Email of the user that created the patient
   */
  Patients.fetchPatientsByFilter = data => {
    return new Promise((resolve, reject) => {
      let filter = {
        include: data.include ? data.include : null,
        where: {
          patient_id: data.patient_ids ? {
            $in: [data.patient_ids]
          } : data.patient_id ? data.patient_id : null,
          mobile_no: data.mobile_nos ? {
            $in: [data.mobile_nos]
          } : data.mobile_no ? data.mobile_no : null,
          patient_name: data.patient_name ? {
            $like: '%' + data.patient_name + '%'
          } : null,
          age: data.age ? data.age : null,
          gender: data.gender ? data.gender : null,
          height: data.height ? data.height : null,
          weight: data.weight ? data.weight : null,
          blood_type: data.blood_type ? data.blood_type : null,
          date_of_birth: data.date_of_birth ? moment(data.date_of_birth, 'YYYY-MM-DD').format('YYYY-MM-DD') : null,
          email: data.email ? {
            $like: '%' + data.email + '%'
          } : null,
          created_by: data.created_by ? data.created_by : null,
          $and: data.$and ? data.$and : null,
          $like: data.$like ? data.$like : null,
          $or: data.$or ? data.$or : null
        }
      };
      !(data.methodName) && (data.methodName = 'findOne');
      !(data.filterScope) && (data.filterScope = 'defaultScope');
      filter && (filter = objectFn.compact(filter));
      filter.where && (filter.where = objectFn.compact(filter.where));
      filter.include && (filter.include = arrayFn.compact(filter.include));
      if (!filter.where) {
        return reject({
          success: false,
          message: 'Insuffiient parameters',
          data: {}
        });
      }
      try {
        models['Patients'].scope(data.filterScope)[data.methodName](filter)
          .then(fetchPatientRes => {
            log.info('---PATIENTS_FETCH_SUCCESS---');
            log.info(fetchPatientRes);
            if (fetchPatientRes) {
              return resolve({
                success: true,
                message: 'Patients fetch success',
                data: {
                  patient_details: fetchPatientRes
                }
              });
            } else {
              return reject({
                success: false,
                error_code: 400,
                message: 'Patients does not exist',
                data: {}
              });
            }
          })
          .catch(fetchPatientErr => {
            log.error('---PATIENTS_FETCH_FAILURE---');
            log.error(fetchPatientErr);
            return reject({
              success: false,
              error_code: 500,
              message: 'Patients fetch failure',
              data: {}
            });
          });
      } catch (error) {
        log.error('---ERROR_CAUGHT---');
        log.error(error);
        return reject({
          success: false,
          error_code: 500,
          message: 'Internal server error',
          data: {}
        });
      }
    });
  }

  /**
   * @param {Object[]} data - Object of where filter and update object
   * @param {Object[]} data.filterObj - Object of the list of filters used to fetch appointment
   * @param {Number} data.filterObj.patient_id Patient id of the patient
   * @param {Number} data.filterObj.reference_id Reference id of the patient
   * @param {Number} data.filterObj.patient_id Patient id of the patient
   * @param {Number} data.appointment_id appointment id of the appointment to be created against
   * @param {Object[]} data.updateObj - Object consists of attributes to be updated
   * @param {String} data.updateObj.patient_name Name of the patient to be created
   * @param {Number} data.updateObj.age Age of the patient to be created
   * @param {String} data.updateObj.gender Gender of the patient to be created
   * @param {Number} data.updateObj.height Height of the patient to be created
   * @param {Number} data.updateObj.weight weight of the patient to be created
   * @param {String} data.updateObj.blood_type Blood type of the patient to be created
   * @param {Date} data.updateObj.date_of_birth Date of birth of the patient
   * @param {String} data.updateObj.email Email of the patient
   * @param {String} data.updateObj.created_by Email of the user that created the patient
   */
  Patients.updatePatientsByFilter = data => {
    return new Promise((resolve, reject) => {
      if (!objectFn.has(data, 'filterObj') || !(objectFn.has(data, 'updateObj'))) {
        return reject({
          success: false,
          error_code: 500,
          message: 'Insufficient parameters',
          data: {}
        });
      }
      let [filterObj, updateObj] = [objectFn.compact(data.filterObj), objectFn.compact(data.updateObj)];
      filterObj.individualHooks = true;
      try {
        models['Patients'].update(updateObj, filterObj)
          .then(updatedPatientsRes => {
            log.info('---updatedPatientsRes---');
            log.info(updatedPatientsRes);
            if (updatedPatientsRes[0]) {
              return resolve({
                success: true,
                message: 'Patients details updated',
                data: {
                  patient_details: updatedPatientsRes[1]
                }
              });
            } else {
              return reject({
                success: false,
                error_code: 500,
                message: 'Patient details could not be updated',
                data: {}
              });
            }
          })
          .catch(updatedPatientsErr => {
            log.error('---updatedPatientsErr---');
            log.error(updatedPatientsErr);
            return reject({
              success: false,
              error_code: 500,
              message: 'Patients details could not be updated',
              data: {}
            });
          });
      } catch (error) {
        log.error('---ERROR_CAUGHT---');
        log.error(error);
        return reject({
          success: false,
          error_code: 500,
          message: 'Internal server error',
          data: {}
        });
      }
    });
  }
}
