const log = require('../../../config/log_config').logger('patient_prescriptions_controller');
const PatientPrescription = require(packageHelper.MODEL_CONFIG_DIR)['PatientPrescription'];
const utils = require('../../utility/utils');
const {
  to
} = require('../utility/helper_function');
const {
  INTERNAL_SERVER_ERROR
} = require('../../../config/response_config');
const {
  MANDATORY_PARAMS: {
    CREATE_PRESCRIPTION
  }
} = require('../../public/javascripts/constants');
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
    ...validateDataResult.data
  };
  let [createPrescriptionError, createPrescriptionResult] = await to(createPrescriptionFunction(createPrescriptionObj));
  if (createPrescriptionError) {
    return utils.generateResponse(createPrescriptionError)(res);
  }
  return utils.generateResponse(createPrescriptionResult)(res);
}

function validateDataFunction(data) {
  return new Promise((resolve, reject) => {
    let paramsCheck = {
      data: data,
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
      created_by: req.user.username
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

module.exports = PatientPrescription;
