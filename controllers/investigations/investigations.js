const log = require('../../../config/log_config').logger('investigations_controller');
const Investigations = require(packageHelper.MODEL_CONFIG_DIR)['Investigations'];

Investigations.fetchExamination = (req, res) => {

  let whereObj = Object.assign({}, req.params);
  models.Investigations.findOne(whereObj)
    .then(fetchRes => {
      log.info('---INVESTIGATIONS_FETCH_SUCCESS---');
      log.info(fetchRes);
      return res.send({
        success: true,
        message: 'Investigations fetching success',
        data: {
          symptom: fetchRes
        }
      });
    })
    .catch(fetchErr => {
      log.info('---INVESTIGATIONS_FETCH_FAILURE---');
      log.info(fetchErr);
      return res.send({
        success: false,
        message: 'Investigations fetching failure',
        data: {
          symptom: fetchErr
        }
      });
    });
}

Investigations.createExamination = (req, res) => {

  let createObj = Object.assign({}, req.body);
  models.Investigations.create(createObj)
    .then(createRes => {
      log.info('---INVESTIGATIONS_CREATION_SUCCESS---');
      log.info(createRes);
      return res.send({
        success: true,
        message: 'Investigation creation success',
        data: {
          symptom: createRes
        }
      });
    })
    .catch(createErr => {
      log.info('---INVESTIGATIONS_CREATION_FAILURE---');
      log.info(createErr);
      return res.send({
        success: false,
        message: 'Investigation creation failure',
        data: {
          symptom: createErr
        }
      });
    });
}

module.exports = Investigations;