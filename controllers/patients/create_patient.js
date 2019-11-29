const log = require('../../config/log_config').logger('patients_controller');
const async = packageHelper.async;

module.exports = Patients => {

  Patients.createPatients = (req, res) => {

    async.auto({
      validateData: validateData,
      createPatient: ['validateData', createPatientFunction]
    }, (async_auto_error, async_auto_result) => {
      if (async_auto_error) {
        return res.status(async_auto_error.error_code).send(async_auto_error);
      } else {
        return res.send(async_auto_result.createPatient);
      }
    });

    const validateData = callback => {
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

    const createPatientFunction = callback => {
      let createObj = Object.assign({}, req.body, {
        created_by: req.user.username
      });
      models['Patients'].scope('activeScope').findOrCreate({
          where: {
            mobile_no: createObj.mobile_no,
            is_active: true,
            is_archived: false
          },
          defaults: createObj
        })
        .then(([create_res, is_new]) => {
          log.info('---PATIENTS_CREATION_SUCCESS---');
          log.info(create_res, is_new);
          if (is_new) {
            return callback({
              success: true,
              message: 'Patients creation success',
              data: {
                patient: create_res.toJSON()
              }
            });
          } else {
            return callback(null, {
              success: false,
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