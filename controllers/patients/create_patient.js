const log = require('../../config/log_config').logger('patients_controller');
const utils = require('../utility/utils');
const moment = packageHelper.moment;
const {
  to
} = require('../utility/helper_function');
const {
  MANDATORY_PARAMS: {
    CREATE_PATIENT
  }
} = require('../../public/javascripts/constants');

module.exports = Patients => {

  Patients.createPatient = async (req, res) => {

    let [validateData_Error, validateData_Result] = await to(validateDataFunction(req));
    if (validateData_Error) {
      return utils.generateResponse(validateData_Error)(res);
    }

    let isNewPatient_Obj = {
      mobile_no: validateData_Result.data.mobile_no
    };
    let [isNewPatientError] = await to(isNewPatientFunction(isNewPatient_Obj));
    if (isNewPatientError) {
      return utils.generateResponse(isNewPatientError)(res);
    }

    let createFunction_Obj = {
      ...validateData_Result.data
    };
    let [createPatientError, createPatientResult] = await to(createPatientFunction(createFunction_Obj));
    if (createPatientError) {
      return utils.generateResponse(createPatientError)(res);
    }
    return utils.generateResponse(createPatientResult)(res);
  }

  function validateDataFunction(data) {
    return new Promise((resolve, reject) => {
      let params_Check = {
        data: data.body,
        mandatoryParams: CREATE_PATIENT,
        checkValType: [{
          key: 'patient_name',
          checkValue: 'STRING'
        }, {
          key: 'mobile_no',
          checkValue: 'NUMBER'
        }, {
          key: 'date_of_birth',
          checkValue: 'DATE'
        }]
      };
      utils.hasMandatoryParams(params_Check)
        .then(param_Result => {
          param_Result.data.user = data.user;
          return resolve(param_Result);
        })
        .catch(param_Error => {
          return reject(param_Error);
        });
    });
  }

  function isNewPatientFunction(data) {
    return new Promise((resolve, reject) => {
      let where = {
        mobile_no: data.mobile_no
      };
      models['Patients']
        .scope('activeScope')
        .findOne({
          where
        })
        .then(existingPatientRes => {
          log.info('---existing_patient_res---');
          log.info(existingPatientRes);
          if (existingPatientRes) {
            return reject({
              success: false,
              error_code: 400,
              message: 'Mobile no already exists,\nkindly priovide a different mobile number',
              data: {}
            });
          } else {
            return resolve(null);
          }
        })
        .catch(existingPatientErr => {
          return reject(existingPatientErr);
        });
    });
  }

  function createPatientFunction(data) {
    return new Promise((resolve, reject) => {
      let create_Obj = {
        ...data,
        created_by: utils.validateKeys(() => data.user.username, null, null),
        date_of_birth: moment(data.date_of_birth).format('YYYY-MM-DD')
      };
      delete create_Obj['user'];
      models['Patients']
        .scope('activeScope')
        .findOrCreate({
          where: {
            mobile_no: create_Obj.mobile_no
          },
          defaults: create_Obj
        })
        .then(([createRes, is_new]) => {
          log.info('---PATIENTS_CREATION_SUCCESS---');
          log.info(createRes, is_new);
          if (is_new) {
            return resolve({
              success: true,
              message: 'Patients creation success',
              data: {
                patient: createRes.toJSON()
              }
            });
          } else {
            return reject({
              success: false,
              error_code: 400,
              message: 'Mobile number already exists,\nkindly priovide a different mobile number',
              data: {}
            });
          }
        })
        .catch(createErr => {
          log.error('---PATIENTS_CREATION_FAILURE---');
          log.error(createErr);
          return reject({
            success: false,
            error_code: 500,
            message: 'Patients creation failure',
            data: {}
          });
        });
    });
  }
}
