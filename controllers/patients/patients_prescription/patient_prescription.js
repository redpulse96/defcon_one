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

  let where_Obj = {
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
  PatientPrescription.fetchPatientPrescriptionByFilter(where_Obj)
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

  let [validateData_Error, validateData_Result] = await to(validateDataFunction(req.body));
  if (validateData_Error) {
    return utils.generateResponse(validateData_Error)(res);
  }

  let createPrescription_Obj = {
    user: req.user,
    ...validateData_Result.data
  };
  let [createPrescriptionError, createPrescriptionResult] = await to(createPrescriptionFunction(createPrescription_Obj));
  if (createPrescriptionError) {
    return utils.generateResponse(createPrescriptionError)(res);
  }

  let createPrescriptionCharges_Obj = {
    ...validateData_Result.data,
    ...createPrescriptionResult.data.patient_prescription_details.dataValues
  };
  let [createPrescriptionChargesError, createPrescriptionChargesResult] = await to(createPrescriptionChargesFunction(createPrescriptionCharges_Obj));
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
    let params_Check = {
      data,
      mandatoryParams: CREATE_PRESCRIPTION
    }
    utils.hasMandatoryParams(params_Check)
      .then(params_Result => {
        resolve(params_Result);
      })
      .catch(params_Error => {
        reject(params_Error);
      });
  });
}

function createPrescriptionFunction(data) {
  return new Promise((resolve, reject) => {
    let create_Obj = {
      ...data,
      created_by: data.user.username
    };
    PatientPrescription.createPatientPrescriptionInstance(create_Obj)
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
      let createMedicinePrescription_Obj = new MedicinesPrescription({
        appointment_id: data.appointment_id ? data.appointment_id : undefined,
        patient_prescription_id: data.patient_prescription_id ? data.patient_prescription_id : undefined
      });

      data.charges && data.charges.length && data.charges.forEach(val => {
        switch (val.entity.toUpperCase()) {

          case 'MEDIC_FEE':
            createMedicinePrescription_Obj.medicine_prescription.push({
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
            createMedicinePrescription_Obj.medicine_prescription.push({
              charge: val.charge ? val.charge : undefined,
              doctor_remarks: val.doctor_remarks ? val.doctor_remarks : undefined
            });
            break;
        }
      });

      createMedicinePrescription_Obj.save()
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
