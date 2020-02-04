const log = require('../../../config/log_config').logger('symptoms_controller');
const Symptoms = require(packageHelper.MODEL_CONFIG_DIR)['Symptoms'];

Symptoms.fetchSymptom = data => {
  return new Promise((resolve, reject) => {
    let where_Obj = {
      where: {
        ...data
      }
    };
    models.Symptoms.findOne(where_Obj)
      .then(fetchRes => {
        log.info('---SYMPTOM_FETCH_SUCCESS---');
        log.info(fetchRes);
        return resolve({
          success: true,
          message: 'Symptoms fetching success',
          data: {
            symptom: fetchRes
          }
        });
      })
      .catch(fetchErr => {
        log.info('---SYMPTOM_FETCH_FAILURE---');
        log.info(fetchErr);
        return reject({
          success: false,
          message: 'Symptoms fetching failure',
          data: {}
        });
      });
  });
}

Symptoms.createSymptom = data => {
  return new Promise((resolve, reject) => {
    let create_Obj = {
      ...data
    };
    models.Symptoms.create(create_Obj)
      .then(createRes => {
        log.info('---SYMPTOM_CREATION_SUCCESS---');
        log.info(createRes);
        return resolve({
          success: true,
          message: 'Symptom creation success',
          data: {
            symptom: createRes
          }
        });
      })
      .catch(createErr => {
        log.info('---SYMPTOM_CREATION_FAILURE---');
        log.info(createErr);
        return reject({
          success: false,
          message: 'Symptom creation failure',
          data: {}
        });
      });
  });
}

module.exports = Symptoms;