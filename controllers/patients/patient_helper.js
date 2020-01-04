const log = require('../../config/log_config').logger('patients_helper');
const moment = packageHelper.moment;
const {
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
      let createObj = {};
      data.mobile_no ? createObj.mobile_no = data.mobile_no : noCreate = true;
      data.patient_name ? createObj.patient_name = data.patient_name : noCreate = true;
      data.blood_type ? createObj.blood_type = data.blood_type : noCreate = true;
      data.date_of_birth ? createObj.date_of_birth = data.date_of_birth : noCreate = true;
      data.gender ? createObj.gender = data.gender : noCreate = true;
      data.created_by ? createObj.created_by = data.created_by : noCreate = true;
      data.age ? createObj.age = data.age : noCreate = true;
      data.height ? createObj.height = data.height : null;
      data.weight ? createObj.weight = data.weight : null;
      data.email ? createObj.email = data.email : null;

      if (noCreate) {
        return reject({
          success: false,
          error_code: 500,
          message: 'Internal server error',
          data: {}
        });
      }
      models['Patients'].create(createObj)
        .then(createRes => {
          log.info('---PATIENTS_CREATION_SUCCESS---');
          log.info(createRes);
          return resolve({
            success: true,
            message: 'Patients creation success',
            data: {
              patient_details: createRes
            }
          });
        })
        .catch(createErr => {
          log.error('---PATIENTS_CREATION_FAILURE---');
          log.error(createErr);
          return reject({
            success: false,
            error_code: 500,
            message: 'Patients creation failure',
            data: {}
          })
        });
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
          created_by: data.created_by ? data.created_by : null
        }
      };
      !(data.filter_scope) ? data.filter_scope = 'defaultScope': null;
      filter.where = objectFn.compact(filter.where);
      models['Patients'].scope(data.filter_scope).findAll(filter)
        .then(createRes => {
          log.info('---PATIENTS_FETCH_SUCCESS---');
          log.info(createRes);
          return resolve({
            success: true,
            message: 'Patients fetch success',
            data: {
              patient_details: createRes
            }
          });
        })
        .catch(createErr => {
          log.error('---PATIENTS_FETCH_FAILURE---');
          log.error(createErr);
          return reject({
            success: false,
            error_code: 500,
            message: 'Patients fetch failure',
            data: {}
          })
        });
    });
  }
}
