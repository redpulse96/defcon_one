const log = require('../../config/log_config').logger('patients_controller');
const async = packageHelper.async;

module.exports = Patients => {

  Patients.updatePatient = (req, res) => {
    async.auto({
      validateData: validateData,
      updatePatient: ['validateData', updatePatientFunction]
    })
    .then(async_auto_res => res.send(async_auto_res.updatePatient))
    .catch(async_auto_err => res.status(async_auto_err.error_code).send(async_auto_err));

    const validateData = callback => {
      let paramsCheck = {
        data: req.body,
        mandatoryParams: ['mobile_no', 'update_obj']
      }
      utils.hasMandatoryParams(paramsCheck)
        .then(res => {
          return callback(null, res);
        })
        .catch(err => {
          return callback(err);
        });
    }

    const updatePatientFunction = callback => {
      models['Patients'].update({
          updatedAt: null,
        }, {
          where: {
            mobile_no: req.body.mobile_no,
            is_active: 1,
            is_archived: 0
          }
        })
        .then(updated_patient_res => {
          log.info('---updated_patient_res---');
          log.info(updated_patient_res);
          if (updated_patient_res) {
            return callback(null, {
              success: true,
              message: 'Patient details updated successfully',
              data: {
                patient_details: updated_patient_res
              }
            });
          } else {
            return callback({
              success: false,
              error_code: 500,
              message: 'Patient details updated failure',
              data: {}
            });
          }
        })
        .catch(updated_patient_err => {
          log.error('---updated_patient_err---');
          log.error(updated_patient_err);
          return callback({
            success: false,
            error_code: 500,
            message: 'Internal server error',
            data: {}
          });
        });
    }
  }
}