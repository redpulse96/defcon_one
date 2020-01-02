const log = require('../config/log_config').logger('users_controller');
const ApiLogs = require('../models/api_logs');

ApiLogs.insertApiLogs = data => {
  return new Promise((resolve, reject) => {
    let createArr = {
      ...data
    };
    ApiLogs.create(createArr)
      .then(createApiLogsRes => {
        log.info('---createApiLogsRes---');
        log.info(createApiLogsRes);
        return resolve({
          success: true,
          message: 'Api logged success',
          data: createApiLogsRes
        });
      })
      .catch(createApiLogsErr => {
        log.error('---createApiLogsErr---');
        log.error(createApiLogsErr);
        return reject({
          success: false,
          message: 'Api logged failure',
          data: {}
        });
      });
  });
}

module.exports = ApiLogs;
