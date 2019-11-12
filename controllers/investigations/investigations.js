const log = require('../../../config/components/log_config').logger('investigations_controller');
const Investigations = require(packageHelper.MODEL_CONFIG_DIR)['Investigations'];

Investigations.fetchExamination = (req, res) => {

  let whereObj = Object.assign({}, req.params);
  models.Investigations.findOne(whereObj)
    .then(fetch_res => {
      log.info('---INVESTIGATIONS_FETCH_SUCCESS---');
      log.info(fetch_res);
      return res.send({
        success: true,
        message: 'Investigations fetching success',
        data: {
          symptom: fetch_res
        }
      });
    })
    .catch(fetch_err => {
      log.info('---INVESTIGATIONS_FETCH_FAILURE---');
      log.info(fetch_err);
      return res.send({
        success: false,
        message: 'Investigations fetching failure',
        data: {
          symptom: fetch_err
        }
      });
    });
}

Investigations.createExamination = (req, res) => {

  let createObj = Object.assign({}, req.body);
  models.Investigations.create(createObj)
    .then(create_res => {
      log.info('---INVESTIGATIONS_CREATION_SUCCESS---');
      log.info(create_res);
      return res.send({
        success: true,
        message: 'Investigation creation success',
        data: {
          symptom: create_res
        }
      });
    })
    .catch(create_err => {
      log.info('---INVESTIGATIONS_CREATION_FAILURE---');
      log.info(create_err);
      return res.send({
        success: false,
        message: 'Investigation creation failure',
        data: {
          symptom: create_err
        }
      });
    });
}

module.exports = Investigations;