const log = require('../../config/log_config').logger('patients_controller');
const utils = require('../utility/utils');
const _ = packageHelper.lodash;
const async = packageHelper.async;

module.exports = Patients => {

  Patients.updatePatientDetails = (req, res) => {
    async.auto({
      validateData: validateDataFunction,
      checkUniqueMobileNo: ['validateData', checkUniqueMobileNoFunction],
      updatePatient: ['checkUniqueMobileNo', updatePatientFunction],
      returnPatientDetails: ['updatePatient', returnPatientDetailsFunction]
    })
    .then(async_auto_res => res.send(async_auto_res.returnPatientDetails))
    .catch(async_auto_err => res.status(async_auto_err.error_code || 500).send(async_auto_err));

    function validateDataFunction(callback) {
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

    function checkUniqueMobileNoFunction(results, callback) {
      const { validateData } = results;
      let filter = {
        where: {
          mobile_no: {
            $in: [validateData.data.mobile_no]
          }
        }
      };
      if (validateData.data.update_obj.mobile_no) {
        filter.where.mobile_no.$in.push(validateData.data.update_obj.mobile_no);
      }
      models['Patients'].scope('activeScope').findOne(filter)
      .then(patient_res => {
        let existingMobileNo = true;
        log.error('---patient_err---');
        log.error(patient_res);
        if (validateData.data.update_obj.mobile_no) {
          existingMobileNo = !!(_.map(patient_res, 'mobile_no').indexOf(validateData.data.update_obj.mobile_no) > -1);
        }
        if (patient_res && existingMobileNo) {
          return callback(null, {
            success: true,
            message: 'The mobile no can be updated',
            data: patient_res
          });
        } else {
          return callback({
            success: true,
            error_code: 400,
            message: 'Mobile no already belongs to a different patient,\nKindly provide a different number',
            data: {}
          });
        }
      })
      .catch(patient_err => {
        log.error('---patient_err---');
        log.error(patient_err);
        return callback({
          success: false,
          error_code: 500,
          message: 'Internal server error',
          data: {}
        });
      });
    }
    
    function updatePatientFunction(results, callback) {
      let filter = {
        where: {
          mobile_no: {
            $in: [req.body.mobile_no]
          },
          is_active: true,
          is_archived: false
        }
      };
      models['Patients'].update(req.body.update_obj, filter)
        .then(updated_patient_res => {
          log.info('---updated_patient_res---');
          log.info(updated_patient_res);
          if (updated_patient_res && updated_patient_res > 0) {
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
              message: 'Patient details updation failure',
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

    function returnPatientDetailsFunction(results, callback) {
      models['Patients'].scope('activeScope').findOne({
        where: {
          mobile_no: req.body.mobile_no
        }
      })
      .then(patient_res => {
        log.info('---patient_res---');
        log.info(patient_res);
        return callback(null, {
          success: true,
          message: 'Patient details',
          data: {
            patient_details: patient_res
          }
        });
      })
      .catch(patient_err => {
        log.error('---patient_err---');
        log.error(patient_err);
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