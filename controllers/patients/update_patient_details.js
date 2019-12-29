const log = require('../../config/log_config').logger('patients_controller');
const utils = require('../utility/utils');
const {
  to,
  arrayFn
} = require('../utility/helper_function');
const {
  MANDATORY_PARAMS: {
    UPDATE_PATIENT
  }
} = require('../../public/javascripts/constants');

module.exports = Patients => {

  Patients.updatePatientDetails = async (req, res) => {

    let [validateDataError, validateDataResult] = await to(validateDataFunction(req));
    if (validateDataError) {
      return utils.generateResponse(validateDataError)(res);
    }

    let checkUniqueMobileNoObj = {
      ...validateDataResult.data
    };
    let [checkUniqueMobileNoError] = await to(checkUniqueMobileNoFunction(checkUniqueMobileNoObj));
    if (checkUniqueMobileNoError) {
      return utils.generateResponse(checkUniqueMobileNoError)(res);
    }

    let updatePatientObj = {
      ...validateDataResult.data
    };
    let [updatePatientError] = await to(updatePatientFunction(updatePatientObj));
    if (updatePatientError) {
      return utils.generateResponse(updatePatientError)(res);
    }

    let returnPatientDetailsObj = {
      ...validateDataResult.data
    }
    let [returnPatientDetailsError, returnPatientDetailsResult] = await to(returnPatientDetailsFunction(returnPatientDetailsObj));
    if (returnPatientDetailsError) {
      return utils.generateResponse(returnPatientDetailsError)(res);
    }
    return utils.generateResponse(returnPatientDetailsResult)(res);
  }

  function validateDataFunction(data) {
    return new Promise((resolve, reject) => {
      let paramsCheck = {
        data: data.body,
        mandatoryParams: UPDATE_PATIENT
      }
      utils.hasMandatoryParams(paramsCheck)
        .then(paramRes => {
          return resolve(paramRes);
        })
        .catch(paramErr => {
          return reject(paramErr);
        });
    });
  }

  function checkUniqueMobileNoFunction(data) {
    return new Promise((resolve, reject) => {
      let filter = {
        where: {
          mobile_no: {
            $in: [data.mobile_no]
          }
        }
      };
      if (data.update_obj.mobile_no) {
        filter.where.mobile_no.$in.push(data.update_obj.mobile_no);
      }
      models['Patients']
        .scope('activeScope')
        .findAll(filter)
        .then(patientRes => {
          log.info('---patientRes---');
          log.info(patientRes);
          if (patientRes && !(arrayFn.mapFn(patientRes, 'mobile_no').indexOf(utils.validateKeys(() => data.update_obj.mobile_no, null, null)) > -1)) {
            return resolve({
              success: true,
              message: 'The mobile_no can be updated',
              data: patientRes
            });
          } else {
            return reject({
              success: true,
              error_code: 400,
              message: 'Mobile no already belongs to a different patient,\nKindly provide a different number',
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
            message: 'Internal server error',
            data: {}
          });
        });
    });
  }

  function updatePatientFunction(data) {
    return new Promise((resolve, reject) => {
      let filter = {
        where: {
          mobile_no: {
            $in: [data.mobile_no]
          },
          is_active: true,
          is_archived: false
        }
      };
      models['Patients']
        .update(data.update_obj, filter)
        .then(updatedPatientRes => {
          log.info('---updatedPatientRes---');
          log.info(updatedPatientRes);
          if (updatedPatientRes && updatedPatientRes > 0) {
            return resolve({
              success: true,
              message: 'Patient details updated successfully',
              data: {
                patient_details: updatedPatientRes
              }
            });
          } else {
            return reject({
              success: false,
              error_code: 500,
              message: 'Patient details updation failure',
              data: {}
            });
          }
        })
        .catch(updatedPatientErr => {
          log.error('---updatedPatientErr---');
          log.error(updatedPatientErr);
          return reject({
            success: false,
            error_code: 500,
            message: 'Internal server error',
            data: {}
          });
        });
    });
  }

  function returnPatientDetailsFunction(data) {
    return new Promise((resolve, reject) => {
      models['Patients']
        .scope('activeScope')
        .findOne({
          where: {
            mobile_no: data.mobile_no
          }
        })
        .then(patientRes => {
          log.info('---returnPatientRes---');
          log.info(patientRes);
          return resolve({
            success: true,
            message: 'Updated patient details',
            data: {
              patient_details: patientRes
            }
          });
        })
        .catch(patientErr => {
          log.error('---returnPatientErr---');
          log.error(patientErr);
          return reject({
            success: false,
            error_code: 500,
            message: 'Internal server error',
            data: {}
          });
        });
    });
  }
}
