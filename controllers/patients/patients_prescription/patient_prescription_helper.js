const log = require('../../../config/log_config').logger('patient_prescription_prescription_helper');
const utils = require('../../utility/utils');
const {
  arrayFn,
  objectFn
} = require('../../utility/helper_function');

module.exports = PatientPrescription => {
  /**
   * @param {Object[]} data - Object with the details to create patient
   * @param {Number} data.patient_id Patient id of the patient
   * @param {Number} data.appointment_id Appointment id of the patient
   * @param {Number} data.reference_id Reference id of the prescription
   * @param {Number} data.medicine_id Medicine id of the prescription
   * @param {String} data.created_by Email of the user that created the patient
   * @param {String} data.doctor_remarks Remarks added my the logged in doctor
   */
  PatientPrescription.createPatientPrescriptionInstance = data => {
    return new Promise((resolve, reject) => {
      let noCreate = false;
      let createObj = {
        patient_id: data.patient_id ? data.patient_id : null && (noCreate = true),
        appointment_id: data.appointment_id ? data.appointment_id : null && (noCreate = true),
        reference_id: data.reference_id ? data.reference_id : utils.GenerateUniqueID(10, 'A#vb'),
        medicine_id: data.medicine_id ? data.medicine_id : null,
        created_by: data.medicine_id ? data.created_by : null,
        doctor_remarks: data.doctor_remarks ? data.doctor_remarks : null
      };
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
        models['PatientPrescription'].create(createObj)
          .then(createPatientPrescriptionRes => {
            log.info('---PATIENTS_PRESCRIPTION_CREATION_SUCCESS---');
            log.info(createPatientPrescriptionRes);
            return resolve({
              success: true,
              message: 'Patient Prescription creation success',
              data: {
                patient_prescription_details: createPatientPrescriptionRes
              }
            });
          })
          .catch(createPatientPrescriptionErr => {
            log.error('---PATIENTS_CREATION_FAILURE---');
            log.error(createPatientPrescriptionErr);
            return reject({
              success: false,
              error_code: 500,
              message: 'Patient Prescription creation failure',
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
   * @param {Array} data.patient_prescription_ids Array of patient prescription ids
   * @param {Number} data.patient_prescription_id Patient id of the patient
   * @param {Array} data.patient_ids Array of patient ids
   * @param {Number} data.patient_id Patient id of the patient
   * @param {Array} data.appointment_ids Array of patient appointment ids
   * @param {Number} data.appointment_id Appointment id of the appointment
   * @param {Array} data.reference_ids Array of reference ids
   * @param {Number} data.reference_id Reference id of the prescription
   * @param {Array} data.medicine_ids Array of medicine ids
   * @param {Number} data.medicine_id Medicine id of the prescription
   * @param {String} data.created_by Email of the user that created the patient
   */
  PatientPrescription.fetchPatientPrescriptionByFilter = data => {
    return new Promise((resolve, reject) => {
      let filter = {
        include: data.include ? data.include : null,
        where: {
          patient_prescription_id: data.patient_prescription_ids ? {
            $in: [data.patient_prescription_ids]
          } : data.patient_prescription_id ? data.patient_prescription_id : null,
          patient_id: data.patient_ids ? {
            $in: [data.patient_ids]
          } : data.patient_id ? data.patient_id : null,
          appointment_id: data.appointment_ids ? {
            $in: [data.appointment_ids]
          } : data.appointment_id ? data.appointment_id : null,
          reference_id: data.reference_ids ? {
            $in: [data.reference_ids]
          } : data.reference_id ? data.reference_id : null,
          medicine_id: data.medicine_ids ? {
            $in: [data.medicine_ids]
          } : data.medicine_id ? data.medicine_id : null,
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
        models['PatientPrescription'].scope(data.filterScope)[data.methodName](filter)
          .then(fetchPatientPrescriptionRes => {
            log.info('---PATIENTS_PRESCRIPTION_FETCH_SUCCESS---');
            log.info(fetchPatientPrescriptionRes);
            if (fetchPatientPrescriptionRes) {
              return resolve({
                success: true,
                message: 'Patient Prescription fetch success',
                data: {
                  patient_prescription_details: fetchPatientPrescriptionRes
                }
              });
            } else {
              return reject({
                success: false,
                error_code: 400,
                message: 'Patient Prescription does not exist',
                data: {}
              });
            }
          })
          .catch(fetchPatientPrescriptionErr => {
            log.error('---PATIENTS_PRESCRIPTION_FETCH_FAILURE---');
            log.error(fetchPatientPrescriptionErr);
            return reject({
              success: false,
              error_code: 500,
              message: 'Patient Prescription fetch failure',
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
   * @param {Number} data.filterObj.patient_prescription_id Patient id of the patient
   * @param {Number} data.filterObj.reference_id Reference id of the patient
   * @param {Number} data.filterObj.patient_id Patient id of the patient
   * @param {Number} data.appointment_id appointment id of the appointment to be created against
   * @param {Object[]} data.updateObj - Object consists of attributes to be updated
   * @param {Number} data.updateObj.patient_id Patient id of the patient
   * @param {Number} data.updateObj.appointment_id Appointment id of the patient
   * @param {Number} data.updateObj.reference_id Reference id of the prescription
   * @param {Number} data.updateObj.medicine_id Medicine id of the prescription
   * @param {String} data.updateObj.created_by Email of the user that created the patient
   * @param {String} data.updateObj.doctor_remarks Remarks added my the logged in doctor
   */
  PatientPrescription.updatePatientPrescriptionByFilter = data => {
    return new Promise((resolve, reject) => {
      if (!objectFn.has(data, 'filterObj') && !(objectFn.has(data, 'updateObj'))) {
        return reject({
          success: false,
          error_code: 500,
          message: 'Insufficient parameters',
          data: {}
        });
      }
      let [filterObj, updateObj] = [objectFn.compact(data.filterObj), objectFn.compact(data.updateObj)];
      try {
        models['PatientPrescriptions'].update(updateObj, filterObj)
          .then(updatedPatientPrescriptionRes => {
            log.info('---updatedPatientPrescriptionRes---');
            log.info(updatedPatientPrescriptionRes);
            if (updatedPatientPrescriptionRes[0]) {
              return resolve({
                success: true,
                message: 'PatientPrescription details updated',
                data: {
                  patient_prescription_detail: updatedPatientPrescriptionRes[1]
                }
              });
            } else {
              return reject({
                success: false,
                error_code: 500,
                message: 'Patient Prescription details could not be updated',
                data: {}
              });
            }
          })
          .catch(updatedPatientPrescriptionErr => {
            log.error('---updatedPatientPrescriptionErr---');
            log.error(updatedPatientPrescriptionErr);
            return reject({
              success: false,
              error_code: 500,
              message: 'PatientPrescription details could not be updated',
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
   * @param {Model[]} data.patientPrescriptionInstance - Model instance of the model whose attributes are to be updated
   * @param {Object[]} data.patientPrescriptionInstanceObj - Object consists of attributes to be updated
   * @param {Number} data.patientPrescriptionInstanceObj.patient_id Patient id of the patient
   * @param {Number} data.patientPrescriptionInstanceObj.appointment_id Appointment id of the appointment of the patient
   * @param {Number} data.patientPrescriptionInstanceObj.medicine_id Medicine id of the prescription
   * @param {String} data.patientPrescriptionInstanceObj.reference_id Reference id of the prescription
   */
  PatientPrescription.updatePatientPrescriptionByInstance = data => {
    return new Promise((resolve, reject) => {
      if (!objectFn.has(data, 'patientPrescriptionInstance') || !(objectFn.has(data, 'patientPrescriptionInstanceObj'))) {
        return reject({
          success: false,
          error_code: 400,
          message: 'Insufficient parameters',
          data: {}
        });
      }
      data['patientPrescriptionInstance'].update(data['updatePatientPrescriptionInstanceObj'])
        .then(updatePatientPrescriptionInstanceResult => {
          log.info('---updatePatientPrescriptionInstanceResult---');
          log.info(updatePatientPrescriptionInstanceResult);
          if (updatePatientPrescriptionInstanceResult) {
            return resolve({
              success: true,
              message: 'patient prescription details updated',
              data: {
                patient_prescription_details: updatePatientPrescriptionInstanceResult
              }
            });
          } else {
            return reject({
              success: false,
              error_code: 500,
              message: 'patient prescription details could not be updated',
              data: {}
            });
          }
        })
        .catch(updatePatientPrescriptionInstanceError => {
          log.error('---updatePatientPrescriptionInstanceError---');
          log.error(updatePatientPrescriptionInstanceError);
          return reject({
            success: false,
            error_code: 500,
            message: 'patient prescription details could not be updated',
            data: {}
          });
        });
    });
  }
}
