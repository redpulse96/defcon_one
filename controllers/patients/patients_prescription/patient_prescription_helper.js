const log = require('../../../config/log_config').logger('patient_prescription_prescription_helper');
const utils = require('../../utility/utils');
const {
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
          })
        });
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

      models['PatientPrescription'].scope(data.filterScope)[data.methodName](filter)
        .then(fetchPatientPrescriptionRes => {
          log.info('---PATIENTS_PRESCRIPTION_FETCH_SUCCESS---');
          log.info(fetchPatientPrescriptionRes);
          return resolve({
            success: true,
            message: 'Patient Prescription fetch success',
            data: {
              patient_prescription_details: fetchPatientPrescriptionRes
            }
          });
        })
        .catch(fetchPatientPrescriptionErr => {
          log.error('---PATIENTS_PRESCRIPTION_FETCH_FAILURE---');
          log.error(fetchPatientPrescriptionErr);
          return reject({
            success: false,
            error_code: 500,
            message: 'Patient Prescription fetch failure',
            data: {}
          })
        });
    });
  }
}
