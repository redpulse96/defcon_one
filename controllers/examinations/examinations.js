const log = require('../../../config/log_config').logger('examinations_controller');
const Examinations = require(packageHelper.MODEL_CONFIG_DIR)['Examinations'];

Examinations.fetchExamination = (req, res) => {

  let whereObj = Object.assign({}, req.params);
  models.Examinations.findOne(whereObj)
    .then(fetchRes => {
      log.info('---EXAMINATIONS_FETCH_SUCCESS---');
      log.info(fetchRes);
      return res.send({
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
      return res.send({
        success: false,
        message: 'Examinations fetching failure',
        data: {
          symptom: fetchErr
        }
      });
    });
}

Examinations.createExamination = (req, res) => {

  let createObj = Object.assign({}, req.body);
  models.Examinations.create(createObj)
    .then(createRes => {
      log.info('---EXAMINATIONS_CREATION_SUCCESS---');
      log.info(createRes);
      return res.send({
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
      return res.send({
        success: false,
        message: 'Examination creation failure',
        data: {
          symptom: createErr
        }
      });
    });
}

module.exports = Examinations;