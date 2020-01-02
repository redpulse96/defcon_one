const log = require('../log_config').logger('log_middleware');
const ApiLogs = require('../../controllers/api_logs');

module.exports = (req, res, next) => {
  log.info(`req.path:: ${req.path}==================>`);
  log.info(`<==================REQ_METHOD==================>`);
  log.info(req.method);
  log.info(`<==================REQ_HEADERS==================>`);
  log.info(req.headers);
  log.info(`<==================START_REQ_PAYLOAD`, req.body || req.params, `END_REQ_PAYLOAD==================>`);
  log.info(`<==================${req.path}`);

  // Save the api context
  let createObj = {
    api_hash: '',
    api_header: req.headers,
    api_method: req.method,
    api_origin: req.origin,
    api_path: req.path,
    api_payload: JSON.stringify(req.params ? req.params : req.body ? req.body : {})
  };
  ApiLogs.insertApiLogs(createObj)
    .then(ApiLogsRes => {
      log.info('LOGS SAVED');
      log.info(ApiLogsRes);
      next();
    })
    .catch(ApiLogsErr => {
      log.fatal('LOGS ARE NOT BEING SAVED');
      log.fatal(ApiLogsErr);
      next();
    });
}
