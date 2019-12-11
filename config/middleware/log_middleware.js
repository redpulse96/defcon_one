const log = require('../log_config').logger('log_middleware');

const apiLogger = (req, res, next) => {
  log.info('<<<<===============API_PATH===============>>>>');
  log.info(req.path);
  log.info('<<<<===============API_METHOD===============>>>>');
  log.info(req.method);
  log.info('<<<<===============API_HEADERS===============>>>>');
  log.info(req.headers);
  log.info('<<<<===============START_API_PAYLOAD===============>>>>');
  log.info(req.body || req.params);
  log.info('<<<<===============END_API_PAYLOAD===============>>>>');
  next();
}

module.exports = {
  apiLogger
}