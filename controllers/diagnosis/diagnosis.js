const log = require('../../../config/log_config').logger('diagnosis_controller');
const Diagnosis = require(packageHelper.MODEL_CONFIG_DIR)['Diagnosis'];

Diagnosis.fetchDiagnosis = (req, res) => {

  let whereObj = Object.assign({}, req.params);
  models.Diagnosis.findOne(whereObj)
    .then(fetch_res => {
      log.info('---DIAGNOSIS_FETCH_SUCCESS---');
      log.info(fetch_res);
      return res.send({
        success: true,
        message: 'Diagnosis fetching success',
        data: {
          symptom: fetch_res
        }
      });
    })
    .catch(fetch_err => {
      log.info('---DIAGNOSIS_FETCH_FAILURE---');
      log.info(fetch_err);
      return res.send({
        success: false,
        message: 'Diagnosis fetching failure',
        data: {
          symptom: fetch_err
        }
      });
    });
}

Diagnosis.createDiagnosis = (req, res) => {

  let createObj = Object.assign({}, req.body);
  models.Diagnosis.create(createObj)
    .then(create_res => {
      log.info('---DIAGNOSIS_CREATION_SUCCESS---');
      log.info(create_res);
      return res.send({
        success: true,
        message: 'Diagnosis creation success',
        data: {
          symptom: create_res
        }
      });
    })
    .catch(create_err => {
      log.info('---DIAGNOSIS_CREATION_FAILURE---');
      log.info(create_err);
      return res.send({
        success: false,
        message: 'Diagnosis creation failure',
        data: {
          symptom: create_err
        }
      });
    });
}

module.exports = Diagnosis;