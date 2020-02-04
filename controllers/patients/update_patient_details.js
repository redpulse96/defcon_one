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

    let [validateData_Error, validateData_Result] = await to(validateDataFunction(req));
    if (validateData_Error) {
      return utils.generateResponse(validateData_Error)(res);
    }

    let checkUniqueMobileNo_Obj = {
      ...validateData_Result.data
    };
    let [checkUniqueMobileNoError] = await to(checkUniqueMobileNoFunction(checkUniqueMobileNo_Obj));
    if (checkUniqueMobileNoError) {
      return utils.generateResponse(checkUniqueMobileNoError)(res);
    }

    let updatePatient_Obj = {
      ...validateData_Result.data
    };
    let [updatePatientError, updatePatientResult] = await to(updatePatientFunction(updatePatient_Obj));
    if (updatePatientError) {
      return utils.generateResponse(updatePatientError)(res);
    }
    return utils.generateResponse(updatePatientResult)(res);
  }

  function validateDataFunction(data) {
    return new Promise((resolve, reject) => {
      let params_Check = {
        data: data.body,
        mandatoryParams: UPDATE_PATIENT
      }
      utils.hasMandatoryParams(params_Check)
        .then(param_Result => {
          return resolve(param_Result);
        })
        .catch(param_Error => {
          return reject(param_Error);
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
        .then(patient_Result => {
          log.info('---patient_Result---');
          log.info(patient_Result);
          if (patient_Result && !(arrayFn.map(patient_Result.data.patient_details, 'mobile_no').indexOf(utils.validateKeys(() => data.update_obj.mobile_no, null, null)) > -1)) {
            return resolve({
              success: true,
              message: 'The mobile_no can be updated',
              data: patient_Result
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
        .catch(patient_Error => {
          log.error('---patient_Error---');
          log.error(patient_Error);
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
        update_Obj: data.update_obj,
        filter_Obj: {
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
