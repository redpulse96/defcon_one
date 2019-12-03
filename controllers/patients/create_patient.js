const log = require('../../config/log_config').logger('patients_controller');
const utils = require('../utility/utils');
const async = packageHelper.async;

module.exports = Patients => {

  Patients.createPatients = (req, res) => {
    async.auto({
      validateData: validateDataFunction,
      isNewPatient: isNewPatientFunction,
      createPatient: ['validateData', createPatientFunction]
    })
    .then(async_auto_result => res.send(async_auto_result.createPatient))
    .catch(async_auto_error => res.status(async_auto_error.error_code || 500).send(async_auto_error));

    function validateDataFunction(callback) {
      let paramsCheck = {
        data: req.body,
        mandatoryParams: ['patient_name', 'mobile_no', 'date_of_birth']
      }
      utils.hasMandatoryParams(paramsCheck)
        .then(res => {
          return callback(null, res)
        })
        .catch(err => {
          return callback(err)
        });
    }

    function isNewPatientFunction(results, callback) {
      const { validateData } = results;
      let where = {
        mobile_no: validateData.data.mobile_no
      };
      models['Patients'].scope('activeScope').findOne({
        where
      })
      .then(existing_patient__res => {
        log.info('---existing_patient__res---');
        log.info(existing_patient__res);
        if (existing_patient__res) {
          return callback({
            success: false,
            error_code: 400,
            message: 'Mobile no alreadt exists,\nkindly priovide a different mobile number',
            data: {}
          });
        } else {
          return callback(null);
        }
      })
      .catch(existing_patient_err => {
        return callback(existing_patient_err);
      });
    }

    function createPatientFunction(results, callback) {
      let createObj = Object.assign({}, req.body, {
        created_by: utils.validateKeys(() => req.user.username, null, null)
      });
      models['Patients']
      .scope('activeScope')
      .findOrCreate({
        where: {
          mobile_no: createObj.mobile_no
        },
        defaults: createObj
      })
      .then(([create_res, is_new]) => {
        log.info('---PATIENTS_CREATION_SUCCESS---');
        log.info(create_res, is_new);
        if (is_new) {
          return callback(null, {
            success: true,
            message: 'Patients creation success',
            data: {
              patient: create_res.toJSON()
            }
          });
        } else {
          return callback({
            success: false,
            error_code: 400,
            message: 'Mobile number already exists,\nkindly priovide a different mobile number',
            data: {}
          });
        }
      })
      .catch(create_err => {
        log.error('---PATIENTS_CREATION_FAILURE---');
        log.error(create_err);
        return callback({
          success: false,
          error_code: 500,
          message: 'Patients creation failure',
          data: {}
        });
      });
    }
  }
}