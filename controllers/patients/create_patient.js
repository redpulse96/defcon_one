const log = require('../../config/log_config').logger('patients_controller');
const utils = require('../utility/utils');
const async = packageHelper.async;
const moment = packageHelper.moment;

module.exports = Patients => {

  Patients.createPatient = (req, res) => {
    async.auto({
      validateData: validateDataFunction,
      isNewPatient: ['validateData', isNewPatientFunction],
      createPatient: ['validateData', 'isNewPatient', createPatientFunction]
    })
      .then(asyncAutoResult => {
        return res.send(asyncAutoResult.createPatient);
      })
      .catch(asyncAutoError => {
        return res.status(asyncAutoError.error_code || 500).send(asyncAutoError);
      });

    function validateDataFunction(callback) {
      let paramsCheck = {
        data: req.body,
        mandatoryParams: ['patient_name', 'mobile_no', 'date_of_birth'],
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
      utils.hasMandatoryParams(paramsCheck)
        .then(paramRes => {
          paramRes.data.user = req.user;
          return callback(null, paramRes);
        })
        .catch(paramErr => {
          return callback(paramErr);
        });
    }
  }

  const isNewPatientFunction = (result, callback) => {
    const {
      validateData
    } = result;
    let where = {
      mobile_no: validateData.data.mobile_no
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
          return callback({
            success: false,
            error_code: 400,
            message: 'Mobile no already exists,\nkindly priovide a different mobile number',
            data: {}
          });
        } else {
          return callback(null);
        }
      })
      .catch(existingPatientErr => {
        return callback(existingPatientErr);
      });
  }

  const createPatientFunction = (result, callback) => {
    const {
      validateData
    } = result;
    let createObj = {
      ...validateData.data,
      created_by: utils.validateKeys(() => validateData.data.user.username, null, null),
      date_of_birth: moment(validateData.data.date_of_birth).format('YYYY-MM-DD')
    };
    models['Patients']
      .scope('activeScope')
      .findOrCreate({
        where: {
          mobile_no: createObj.mobile_no
        },
        defaults: createObj
      })
      .then(([createRes, is_new]) => {
        log.info('---PATIENTS_CREATION_SUCCESS---');
        log.info(createRes, is_new);
        if (is_new) {
          return callback(null, {
            success: true,
            message: 'Patients creation success',
            data: {
              patient: createRes.toJSON()
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
      .catch(createErr => {
        log.error('---PATIENTS_CREATION_FAILURE---');
        log.error(createErr);
        return callback({
          success: false,
          error_code: 500,
          message: 'Patients creation failure',
          data: {}
        });
      });
  }
}
