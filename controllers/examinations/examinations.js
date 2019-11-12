const log = require('../../../config/components/log_config').logger('examinations_controller');
const Examinations = require(packageHelper.MODEL_CONFIG_DIR)['Examinations'];

Examinations.fetchExamination = (req, res) => {

  let whereObj = Object.assign({}, req.params);
  models.Examinations.findOne(whereObj)
    .then(fetch_res => {
      log.info('---EXAMINATIONS_FETCH_SUCCESS---');
      log.info(fetch_res);
      return res.send({
        success: true,
        message: 'Examinations fetching success',
        data: {
          symptom: fetch_res
        }
      });
    })
    .catch(fetch_err => {
      log.info('---EXAMINATIONS_FETCH_FAILURE---');
      log.info(fetch_err);
      return res.send({
        success: false,
        message: 'Examinations fetching failure',
        data: {
          symptom: fetch_err
        }
      });
    });
}

Examinations.createExamination = (req, res) => {

  let createObj = Object.assign({}, req.body);
  models.Examinations.create(createObj)
    .then(create_res => {
      log.info('---EXAMINATIONS_CREATION_SUCCESS---');
      log.info(create_res);
      return res.send({
        success: true,
        message: 'Examination creation success',
        data: {
          symptom: create_res
        }
      });
    })
    .catch(create_err => {
      log.info('---EXAMINATIONS_CREATION_FAILURE---');
      log.info(create_err);
      return res.send({
        success: false,
        message: 'Examination creation failure',
        data: {
          symptom: create_err
        }
      });
    });
}

module.exports = Examinations;