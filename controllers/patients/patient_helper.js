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
          created_by: data.created_by ? data.created_by : null
        }
      };
      !(data.methodName) && (data.methodName = 'findOne');
      !(data.filterScope) && (data.filterScope = 'defaultScope');
      filter.include = objectFn.compact(filter.include);
      filter.where = objectFn.compact(filter.where);
      if (!filter.where) {
        return reject({
          success: false,
          message: 'Insuffiient parameters',
          data: {}
        });
      }

      models['Patients'].scope(data.filterScope)[data.methodName](filter)
        .then(fetchPatientRes => {
          log.info('---PATIENTS_FETCH_SUCCESS---');
          log.info(fetchPatientRes);
          return resolve({
            success: true,
            message: 'Patients fetch success',
            data: {
              patient_details: fetchPatientRes
            }
          });
        })
        .catch(fetchPatientErr => {
          log.error('---PATIENTS_FETCH_FAILURE---');
          log.error(fetchPatientErr);
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
