const log = require('../../config/log_config').logger('medicines_prescription');
const utils = require('../utility/utils');
const async = packageHleper.async;
const {
  MANDATORY_PARAMS: {
    CREATE_MEDICINE_PRESCRIPTION
  }
} = require('../../public/javascripts/constants');
const {
  to
} = require('../utility/helper_function');

module.exports = MedicinesPrescription => {
  MedicinesPrescription.createMedicinesPrescription = async (req, res) => {
    let [validateDataError, validateDataResult] = await to(validateDataFunction(req));
    if (validateDataError) {
      return utils.generateResponse(validateDataError)(res);
    }

    let createMedicinesPrescriptionObj = {
      ...validateDataResult.data
    };
    let [createMedicinesPrescriptionError, createMedicinesPrescriptionResult] = await to(createMedicinesPrescription(createMedicinesPrescriptionObj));
    if (createMedicinesPrescriptionError) {
      return utils.generateResponse(createMedicinesPrescriptionError)(res);
    }
    return utils.generateResponse(createMedicinesPrescriptionResult)(res);
  }

  function validateDataFunction(data) {
    return new Promise((resolve, reject) => {
      let paramsCheck = {
        data: data.body,
        mandatoryParams: CREATE_MEDICINE_PRESCRIPTION
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

  function createMedicinesPrescription(data) {
    log.info('---createMedicinesPrescription---data---');
    log.info(data);
    return new Promise((resolve, reject) => {
      let createArr = [];
      async.map(data, async elem => {
        let obj = {
          ...elem
        };
        createArr.push(obj);
      });
      let [createMedicinesPrescriptionError, createMedicinesPrescriptionResult] = await to(MedicinesPrescription.create(createArr));
      log.error('---MedicinesPrescription.createMedicinesPrescriptionError---');
      log.error(createMedicinesPrescriptionError);
      log.info('---MedicinesPrescription.createMedicinesPrescriptionResult---');
      log.info(createMedicinesPrescriptionResult);
      if (createMedicinesPrescriptionError) {
        return reject({
          success: false,
          message: 'Creating medical prescription error',
          data: {}
        });
      } else {
        return resolve({
          success: true,
          message: 'Creating medical prescription success',
          data: {
            medicine_prescription: createMedicinesPrescriptionResult
          }
        });
      }
    });
  }
}
