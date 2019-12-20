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
      .then(asyncAutoRes => {
        return res.send(asyncAutoRes.returnPatientDetails);
      })
      .catch(asyncAutoErr => {
        return res.status(asyncAutoErr.error_code || 500).send(asyncAutoErr);
      });

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
  }

  const checkUniqueMobileNoFunction = (result, callback) => {
    const {
      validateData
    } = result;
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
      .then(patientRes => {
        let existingMobileNo = true;
        log.error('---patientErr---');
        log.error(patientRes);
        if (validateData.data.update_obj.mobile_no) {
          existingMobileNo = !!(_.map(patientRes, 'mobile_no').indexOf(validateData.data.update_obj.mobile_no) > -1);
        }
        if (patientRes && existingMobileNo) {
          return callback(null, {
            success: true,
            message: 'The mobile no can be updated',
            data: patientRes
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
      .catch(patientErr => {
        log.error('---patientErr---');
        log.error(patientErr);
        return callback({
          success: false,
          error_code: 500,
          message: 'Internal server error',
          data: {}
        });
      });
  }

  const updatePatientFunction = (result, callback) => {
    const {
      validateData
    } = result;
    let filter = {
      where: {
        mobile_no: {
          $in: [validateData.data.mobile_no]
        },
        is_active: true,
        is_archived: false
      }
    };
    models['Patients'].update(validateData.data.update_obj, filter)
      .then(updatedPatientRes => {
        log.info('---updatedPatientRes---');
        log.info(updatedPatientRes);
        if (updatedPatientRes && updatedPatientRes > 0) {
          return callback(null, {
            success: true,
            message: 'Patient details updated successfully',
            data: {
              patient_details: updatedPatientRes
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
      .catch(updatedPatientErr => {
        log.error('---updatedPatientErr---');
        log.error(updatedPatientErr);
        return callback({
          success: false,
          error_code: 500,
          message: 'Internal server error',
          data: {}
        });
      });
  }

  const returnPatientDetailsFunction = (result, callback) => {
    const {
      validateData
    } = result;
    models['Patients'].scope('activeScope').findOne({
      where: {
        mobile_no: validateData.data.mobile_no
      }
    })
      .then(patientRes => {
        log.info('---patientRes---');
        log.info(patientRes);
        return callback(null, {
          success: true,
          message: 'Patient details',
          data: {
            patient_details: patientRes
          }
        });
      })
      .catch(patientErr => {
        log.error('---patientErr---');
        log.error(patientErr);
        return callback({
          success: false,
          error_code: 500,
          message: 'Internal server error',
          data: {}
        });
      });
  }
}
