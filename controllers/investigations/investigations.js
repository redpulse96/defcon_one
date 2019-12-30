const log = require('../../../config/log_config').logger('investigations_controller');
const Investigations = require(packageHelper.MODEL_CONFIG_DIR)['Investigations'];

Investigations.fetchInvestigations = data => {
  return new Promise((resolve, reject) => {
    let whereObj = {
      where: {
        ...data
      }
    };
    models.Investigations.findOne(whereObj)
      .then(fetchRes => {
        log.info('---INVESTIGATIONS_FETCH_SUCCESS---');
        log.info(fetchRes);
        return resolve({
          success: true,
          message: 'Investigations fetching success',
          data: {
            investigations: fetchRes
          }
        });
      })
      .catch(fetchErr => {
        log.info('---INVESTIGATIONS_FETCH_FAILURE---');
        log.info(fetchErr);
        return reject({
          success: false,
          message: 'Investigations fetching failure',
          data: {}
        });
      });
  });
}

Investigations.createInvestigations = data => {
  return new Promise((resolve, reject) => {
    let createObj = {
      ...data
    };
    models.Investigations.create(createObj)
      .then(createRes => {
        log.info('---INVESTIGATIONS_CREATION_SUCCESS---');
        log.info(createRes);
        return resolve({
          success: true,
          message: 'Investigation creation success',
          data: {
            investigations: createRes
          }
        });
      })
      .catch(createErr => {
        log.info('---INVESTIGATIONS_CREATION_FAILURE---');
        log.info(createErr);
        return reject({
          success: false,
          message: 'Investigation creation failure',
          data: {}
        });
      });
  });
}

module.exports = Investigations;