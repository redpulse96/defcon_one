const log = require('../log_config').logger('log_middleware');

module.exports = (req, res, next) => {
  log.info(`req.path:: ${req.path}==================>`);
  log.info('<==================REQ_METHOD==================>');
  log.info(req.method);
  log.info('<==================REQ_HEADERS==================>');
  log.info(req.headers);
  log.info('<==================START_REQ_PAYLOAD', req.body || req.params, 'END_REQ_PAYLOAD==================>');
  log.info(`<==================${req.path}`);
  next();
}
