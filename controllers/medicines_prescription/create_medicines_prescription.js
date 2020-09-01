const log = require('../../config/log_config').logger('medicines_prescription');
import {
  generateResponse,
  hasMandatoryParams
} from '../utility/utils';
const async = packageHelper.async;
import constants from '../../public/javascripts/constants';
const {
  MANDATORY_PARAMS: {
    CREATE_MEDICINE_PRESCRIPTION
  }
} = constants;
import {
  to
} from '../utility/helper_function';

export default MedicinesPrescription => {
  MedicinesPrescription.createMedicinesPrescription = async (req, res) => {
    let [validateData_Error, validateData_Result] = await to(validateDataFunction(req));
    if (validateData_Error) {
      return generateResponse(validateData_Error)(res);
    }

    let createMedicinesPrescription_Obj = {
      ...validateData_Result.data
    };
    let [createMedicinesPrescriptionError, createMedicinesPrescriptionResult] = await to(createMedicinesPrescription(createMedicinesPrescription_Obj));
    if (createMedicinesPrescriptionError) {
      return generateResponse(createMedicinesPrescriptionError)(res);
    }
    return generateResponse(createMedicinesPrescriptionResult)(res);
  }

  function validateDataFunction(data) {
    return new Promise((resolve, reject) => {
      let params_Check = {
        data: data.body,
        mandatoryParams: CREATE_MEDICINE_PRESCRIPTION
      }
      hasMandatoryParams(params_Check)
        .then(param_Result => {
          return resolve(param_Result);
        })
        .catch(param_Error => {
          return reject(param_Error);
        });
    });
  }

  function createMedicinesPrescription(data) {
    log.info('---createMedicinesPrescription.data---');
    log.info(data);
    return new Promise((resolve, reject) => {
      let createArr = [];
      async.map(data, elem => {
        let obj = {
          ...elem
        };
        createArr.push(obj);
      });
      let [createMedicinesPrescriptionError, createMedicinesPrescriptionResult] = to(MedicinesPrescription.create(createArr));
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