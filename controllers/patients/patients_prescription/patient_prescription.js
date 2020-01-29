const log = require('../../../config/log_config').logger('patient_prescriptions_controller');
const MedicinesPrescription = require('../../../models/medicines_prescription');
const PatientPrescription = require(packageHelper.MODEL_CONFIG_DIR)['PatientPrescription'];
const utils = require('../../utility/utils');
const {
  to
} = require('../../utility/helper_function');
const {
  INTERNAL_SERVER_ERROR
} = require('../../../config/response_config');
const {
  MANDATORY_PARAMS: {
    CREATE_PRESCRIPTION
  }
} = require('../../../public/javascripts/constants');
require('./patient_prescription_helper')(PatientPrescription);

PatientPrescription.fetchPatientPrescription = (req, res) => {

  let whereObj = {
    ...req.params,
    methodName: 'findOne',
    include: [{
      model: models['Appointments'],
      as: 'appointment',
      include: [{
        model: models['AppointmentDiagnosisRoleMapping'],
        as: 'appointment_diagnosis_role_mapping'
      }, {
        model: models['AppointmentExaminationsRoleMapping'],
        as: 'appointment_examinations_role_mapping'
      }, {
        model: models['AppointmentInvestigationsRoleMapping'],
        as: 'appointment_investigations_role_mapping'
      }, {
        model: models['AppointmentSymptomsRoleMapping'],
        as: 'appointment_symptoms_role_mapping'
      }]
    }]
  };
  PatientPrescription.fetchPatientPrescriptionByFilter(whereObj)
    .then(fetchRes => {
      fetchRes = fetchRes.toJSON();
      log.info('---PATIENT_PRESCRIPTION_FETCH_SUCCESS---');
      log.info(fetchRes);
      return res.send({
        success: true,
        message: 'PatientPrescription fetching success',
        data: {
          patient_prescription: fetchRes
        }
      });
    })
    .catch(fetchErr => {
      log.info('---PATIENT_PRESCRIPTION_FETCH_FAILURE---');
      log.info(fetchErr);
      return utils.generateResponse(INTERNAL_SERVER_ERROR)(res);
    });
}

PatientPrescription.createPatientPrescription = async (req, res) => {

  let [validateDataError, validateDataResult] = await to(validateDataFunction(req.body));
  if (validateDataError) {
    return utils.generateResponse(validateDataError)(res);
  }

  let createPrescriptionObj = {
    user: req.user,
    ...validateDataResult.data
  };
  let [createPrescriptionError, createPrescriptionResult] = await to(createPrescriptionFunction(createPrescriptionObj));
  if (createPrescriptionError) {
    return utils.generateResponse(createPrescriptionError)(res);
  }

  let createPrescriptionChargesObj = {
    ...validateDataResult.data,
    ...createPrescriptionResult.data.patient_prescription_details.dataValues
  };
  let [createPrescriptionChargesError, createPrescriptionChargesResult] = await to(createPrescriptionChargesFunction(createPrescriptionChargesObj));
  if (createPrescriptionChargesError) {
    return utils.generateResponse(createPrescriptionChargesError)(res);
  }
  createPrescriptionResult.data = {
    ...createPrescriptionResult.data,
    ...createPrescriptionChargesResult.data
  };
  return utils.generateResponse(createPrescriptionResult)(res);
}

function validateDataFunction(data) {
  return new Promise((resolve, reject) => {
    let paramsCheck = {
      data,
      mandatoryParams: CREATE_PRESCRIPTION
    }
    utils.hasMandatoryParams(paramsCheck)
      .then(paramsRes => {
        resolve(paramsRes);
      })
      .catch(paramsErr => {
        reject(paramsErr);
      });
  });
}

function createPrescriptionFunction(data) {
  return new Promise((resolve, reject) => {
    let createObj = {
      ...data,
      created_by: data.user.username
    };
    PatientPrescription.createPatientPrescriptionInstance(createObj)
      .then(createRes => {
        log.info('---PATIENT_PRESCRIPTION_CREATION_SUCCESS---');
        log.info(createRes);
        return resolve(createRes);
      })
      .catch(createErr => {
        log.info('---PATIENT_PRESCRIPTION_CREATION_FAILURE---');
        log.info(createErr);
        return reject(createErr);
      });
  });
}

function createPrescriptionChargesFunction(data) {
  return new Promise((resolve, reject) => {
    if (data.prescription_charges && data.prescription_charges.length) {
      let createMedicinePrescriptionObj = new MedicinesPrescription({
        appointment_id: data.appointment_id ? data.appointment_id : undefined,
        patient_prescription_id: data.patient_prescription_id ? data.patient_prescription_id : undefined
      });

      data.charges && data.charges.length && data.charges.forEach(val => {
        switch (val.entity.toUpperCase()) {

          case 'MEDIC_FEE':
            createMedicinePrescriptionObj.medicine_prescription.push({
              medicine_id: val.medicine_id ? val.medicine_id : undefined,
              morning_dosage: val.morning_dosage ? val.morning_dosage : undefined,
              noon_dosage: val.noon_dosage ? val.noon_dosage : undefined,
              evening_dosage: val.evening_dosage ? val.evening_dosage : undefined,
              quantity: val.quantity ? val.quantity : undefined,
              charge: val.charge ? val.charge : undefined,
              doctor_remarks: val.doctor_remarks ? val.doctor_remarks : undefined
            });
            break;

          case 'DOC_FEE':
            createMedicinePrescriptionObj.medicine_prescription.push({
              charge: val.charge ? val.charge : undefined,
              doctor_remarks: val.doctor_remarks ? val.doctor_remarks : undefined
            });
            break;
        }
      });

      createMedicinePrescriptionObj.save()
        .then(createMedicinePrescriptionRes => {
          log.info('---createMedicinePrescriptionRes---');
          log.info(createMedicinePrescriptionRes);
          return resolve({
            success: true,
            message: 'Medicines prescription charges saved',
            data: {
              prescription_charges: createMedicinePrescriptionRes
            }
          });
        })
        .catch(createMedicinePrescriptionErr => {
          log.error('---createMedicinePrescriptionErr---');
          log.error(createMedicinePrescriptionErr);
          return reject(INTERNAL_SERVER_ERROR);
        });
    } else {
      return resolve({
        success: true,
        message: 'No charges applied',
        data: {}
      });
    }
  });
}

module.exports = PatientPrescription;
