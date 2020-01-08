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
    let [updatePatientError, updatePatientResult] = await to(updatePatientFunction(updatePatientObj));
    if (updatePatientError) {
      return utils.generateResponse(updatePatientError)(res);
    }
    return utils.generateResponse(updatePatientResult)(res);
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
        methodName: 'findAll',
        filterScope: 'activeScope',
        mobile_nos: [data.mobile_no]
      };
      if (data.update_obj.mobile_no) {
        filter.mobile_nos.push(data.update_obj.mobile_no);
      }
      Patients.fetchPatientsByFilter(filter)
        .then(patientRes => {
          log.info('---patientRes---');
          log.info(patientRes);
          if (patientRes && !(arrayFn.map(patientRes.data.patient_details, 'mobile_no').indexOf(utils.validateKeys(() => data.update_obj.mobile_no, null, null)) > -1)) {
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
        updateObj: data.update_obj,
        filterObj: {
          where: {
            mobile_no: {
              $in: [data.mobile_no]
            },
            is_active: true,
            is_archived: false
          }
        }
      };
      Patients.updatePatientsByFilter(filter)
        .then(updatedPatientRes => {
          updatedPatientRes.data ? updatedPatientRes.data.patient_details ? updatedPatientRes.data.patient_details = updatedPatientRes.data.patient_details[0] : null : null;
          return resolve(updatedPatientRes);
        })
        .catch(updatedPatientErr => {
          return reject(updatedPatientErr);
        });
    });
  }
}
