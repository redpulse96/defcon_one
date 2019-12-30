const log = require('../../../config/log_config').logger('diagnosis_controller');
const Diagnosis = require(packageHelper.MODEL_CONFIG_DIR)['Diagnosis'];

Diagnosis.fetchDiagnosis = data => {
  return new Promise((resolve, reject) => {
    let whereObj = {
      where: {
        ...data
      }
    };
    models.Diagnosis.findOne(whereObj)
      .then(fetchRes => {
        log.info('---DIAGNOSIS_FETCH_SUCCESS---');
        log.info(fetchRes);
        return resolve({
          success: true,
          message: 'Diagnosis fetching success',
          data: {
            diagnosis: fetchRes
          }
        });
      })
      .catch(fetchErr => {
        log.info('---DIAGNOSIS_FETCH_FAILURE---');
        log.info(fetchErr);
        return reject({
          success: false,
          message: 'Diagnosis fetching failure',
          data: {}
        });
      });
  });
}

Diagnosis.createDiagnosis = data => {
  return new Promise((resolve, reject) => {
    let createObj = {
      ...data
    };
    models.Diagnosis.create(createObj)
      .then(createRes => {
        log.info('---DIAGNOSIS_CREATION_SUCCESS---');
        log.info(createRes);
        return resolve({
          success: true,
          message: 'Diagnosis creation success',
          data: {
            diagnosis: createRes
          }
        });
      })
      .catch(createErr => {
        log.info('---DIAGNOSIS_CREATION_FAILURE---');
        log.info(createErr);
        return reject({
          success: false,
          message: 'Diagnosis creation failure',
          data: {}
        });
      });
  });
}

module.exports = Diagnosis;