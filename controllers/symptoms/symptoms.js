const log = require('../../../config/log_config').logger('symptoms_controller');
const Symptoms = require(packageHelper.MODEL_CONFIG_DIR)['Symptoms'];

Symptoms.fetchSymptom = (req, res) => {

  let whereObj = Object.assign({}, req.params);
  models.Symptoms.findOne(whereObj)
    .then(fetch_res => {
      log.info('---SYMPTOM_FETCH_SUCCESS---');
      log.info(fetch_res);
      return res.send({
        success: true,
        message: 'Symptoms fetching success',
        data: {
          symptom: fetch_res
        }
      });
    })
    .catch(fetch_err => {
      log.info('---SYMPTOM_FETCH_FAILURE---');
      log.info(fetch_err);
      return res.send({
        success: false,
        message: 'Symptoms fetching failure',
        data: {
          symptom: fetch_err
        }
      });
    });
}

Symptoms.createSymptom = (req, res) => {

  let createObj = Object.assign({}, req.body);
  models.Symptoms.create(createObj)
    .then(create_res => {
      log.info('---SYMPTOM_CREATION_SUCCESS---');
      log.info(create_res);
      return res.send({
        success: true,
        message: 'Symptom creation success',
        data: {
          symptom: create_res
        }
      });
    })
    .catch(create_err => {
      log.info('---SYMPTOM_CREATION_FAILURE---');
      log.info(create_err);
      return res.send({
        success: false,
        message: 'Symptom creation failure',
        data: {
          symptom: create_err
        }
      });
    });
}

module.exports = Symptoms;