const log = require('../../../config/log_config').logger('symptoms_controller');
const Symptoms = require(packageHelper.MODEL_CONFIG_DIR)['Symptoms'];

Symptoms.fetchSymptom = (req, res) => {

  let whereObj = {
    ...req.params
  };
  models.Symptoms.findOne(whereObj)
    .then(fetchRes => {
      log.info('---SYMPTOM_FETCH_SUCCESS---');
      log.info(fetchRes);
      return res.send({
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
      return res.send({
        success: false,
        message: 'Symptoms fetching failure',
        data: {
          symptom: fetchErr
        }
      });
    });
}

Symptoms.createSymptom = (req, res) => {

  let createObj = {
    ...req.body
  };
  models.Symptoms.create(createObj)
    .then(createRes => {
      log.info('---SYMPTOM_CREATION_SUCCESS---');
      log.info(createRes);
      return res.send({
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
      return res.send({
        success: false,
        message: 'Symptom creation failure',
        data: {
          symptom: createErr
        }
      });
    });
}

module.exports = Symptoms;