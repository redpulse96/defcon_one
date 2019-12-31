const log = require('../../../config/log_config').logger('examinations_controller');
const Examinations = require(packageHelper.MODEL_CONFIG_DIR)['Examinations'];

Examinations.fetchExamination = data => {
  return new Promise((resolve, reject) => {
    let whereObj = {
      where: {
        ...data
      }
    };
    models.Examinations.findOne(whereObj)
      .then(fetchRes => {
        log.info('---EXAMINATIONS_FETCH_SUCCESS---');
        log.info(fetchRes);
        return resolve({
          success: true,
          message: 'Examinations fetching success',
          data: {
            symptom: fetchRes
          }
        });
      })
      .catch(fetchErr => {
        log.info('---EXAMINATIONS_FETCH_FAILURE---');
        log.info(fetchErr);
        return reject({
          success: false,
          message: 'Examinations fetching failure',
          data: {
            symptom: fetchErr
          }
        });
      });
  });
}

Examinations.createExamination = data => {
  return new Promise((resolve, reject) => {
    let createObj = {
      ...data
    };
    models.Examinations.create(createObj)
      .then(createRes => {
        log.info('---EXAMINATIONS_CREATION_SUCCESS---');
        log.info(createRes);
        return resolve({
          success: true,
          message: 'Examination creation success',
          data: {
            symptom: createRes
          }
        });
      })
      .catch(createErr => {
        log.info('---EXAMINATIONS_CREATION_FAILURE---');
        log.info(createErr);
        return reject({
          success: false,
          message: 'Examination creation failure',
          data: {
            symptom: createErr
          }
        });
      });
  });
}

module.exports = Examinations;