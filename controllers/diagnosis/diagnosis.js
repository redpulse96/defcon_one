const log = require('../../../config/log_config').logger('diagnosis_controller');
const Diagnosis = require(packageHelper.MODEL_CONFIG_DIR)['Diagnosis'];

Diagnosis.fetchDiagnosis = (req, res) => {

  let whereObj = {
    ...req.params
  };
  models.Diagnosis.findOne(whereObj)
    .then(fetchRes => {
      log.info('---DIAGNOSIS_FETCH_SUCCESS---');
      log.info(fetchRes);
      return res.send({
        success: true,
        message: 'Diagnosis fetching success',
        data: {
          symptom: fetchRes
        }
      });
    })
    .catch(fetchErr => {
      log.info('---DIAGNOSIS_FETCH_FAILURE---');
      log.info(fetchErr);
      return res.send({
        success: false,
        message: 'Diagnosis fetching failure',
        data: {
          symptom: fetchErr
        }
      });
    });
}

Diagnosis.createDiagnosis = (req, res) => {

  let createObj = {
    ...req.body
  };
  models.Diagnosis.create(createObj)
    .then(createRes => {
      log.info('---DIAGNOSIS_CREATION_SUCCESS---');
      log.info(createRes);
      return res.send({
        success: true,
        message: 'Diagnosis creation success',
        data: {
          symptom: createRes
        }
      });
    })
    .catch(createErr => {
      log.info('---DIAGNOSIS_CREATION_FAILURE---');
      log.info(createErr);
      return res.send({
        success: false,
        message: 'Diagnosis creation failure',
        data: {
          symptom: createErr
        }
      });
    });
}

module.exports = Diagnosis;