const packageHelper = require('./package_helper');

const { createLogger, format, transports } = packageHelper.winston;

generateLogger = (serviceName, level) => {
  let levelName = level ? level : 'info';
  let generateLogObj = {};

  switch (levelName) {
    case 'info':
      generateLogObj = {
        defaultMeta: {
          level: 'info',
          service: serviceName || 'defcon_one'
        },
        transports: [
          new transports.Console(),
          new transports.File({
            filename: packageHelper.LOGS_DIR + 'defcon_one_info.log',
            level: 'info'
          })
        ]
      };
      break;
    case 'error':
      generateLogObj = {
        defaultMeta: {
          level: 'error',
          service: serviceName || 'defcon_one'
        },
        format: format.combine(
          format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
          }),
          format.errors({
            stack: true
          }),
          format.errors({
            stack: true
          }),
          format.splat(),
          format.json()
        ),
        transports: [
          new transports.File({
            filename: packageHelper.LOGS_DIR + 'defcon_one_error.log',
            level: 'error'
          })
        ]
      };
      break;
    case 'debug':
      generateLogObj = {
        defaultMeta: {
          level: 'debug',
          service: serviceName || 'defcon_one'
        },
        format: format.combine(
          format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
          }),
          format.errors({
            stack: true
          }),
          format.splat(),
          format.json()
        ),
        transports: [
          new transports.Console({
            format: format.combine(
              format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
              }),
              format.errors({
                stack: true
              }),
              format.splat(),
              format.json()
            )
          }),
          new transports.File({
            filename: packageHelper.LOGS_DIR + 'defcon_one_debug.log',
            level: 'debug'
          })
        ]
      };
      break;
    case 'warning':
      generateLogObj = {
        defaultMeta: {
          level: 'warning',
          service: serviceName || 'defcon_one'
        },
        format: format.combine(
          format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
          }),
          format.errors({
            stack: true
          }),
          format.splat(),
          format.json()
        ),
        transports: [
          new transports.Console({
            format: format.combine(
              format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
              }),
              format.errors({
                stack: true
              }),
              format.splat(),
              format.json()
            )
          }),
          new transports.File({
            filename: packageHelper.LOGS_DIR + 'defcon_one_warn.log',
            level: 'warning'
          })
        ]
      };
      break;
    case 'trace':
      generateLogObj = {
        defaultMeta: {
          level: 'trace',
          service: serviceName || 'defcon_one'
        },
        format: format.combine(
          format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
          }),
          format.errors({
            stack: true
          }),
          format.splat(),
          format.json()
        ),
        transports: [
          new transports.Console({
            format: format.combine(
              format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
              }),
              format.errors({
                stack: true
              }),
              format.splat(),
              format.json()
            )
          }),
          new transports.File({
            filename: packageHelper.LOGS_DIR + 'defcon_one_trace.log',
            level: 'trace'
          })
        ]
      };
      break;
    case 'crit':
      generateLogObj = {
        defaultMeta: {
          level: 'crit',
          service: serviceName || 'defcon_one'
        },
        format: format.combine(
          format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
          }),
          format.errors({
            stack: true
          }),
          format.splat(),
          format.json()
        ),
        transports: [
          new transports.File({
            filename: packageHelper.LOGS_DIR + 'defcon_one_crit.log',
            level: 'crit'
          })
        ]
      };
      break;
    default:
      generateLogObj = {
        defaultMeta: {
          level: 'fatal',
          service: serviceName || 'defcon_one'
        },
        format: format.combine(
          format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
          }),
          format.errors({
            stack: true
          }),
          format.splat(),
          format.json()
        ),
        transports: [
          new transports.File({
            filename: packageHelper.LOGS_DIR + 'defcon_one_fatal.log',
            level: 'fatal'
          })
        ]
      };
      break;
  }
  return createLogger(generateLogObj);
}

const logger = (serviceName) => {
  const newLog = {
    info: generateLogger(serviceName, 'info'),
    error: generateLogger(serviceName, 'error'),
    debug: generateLogger(serviceName, 'debug'),
    warning: generateLogger(serviceName, 'warning')
  };

  const constructLog = level => {
    let levelName = level ? level : 'info';

    return (...args) => {
      try {
        newLog[levelName].log({
          service: serviceName,
          level: levelName,
          message: args,
          timestamp: new Date()
        });
      } catch (e) {
        console.log('ERROR_IN_LOGS: ');
        console.dir(JSON.stringify(e));
      }
    }
  }

  let logObj = {
    info: constructLog('info'),
    error: constructLog('error'),
    trace: constructLog('trace'),
    debug: constructLog('debug'),
    warning: constructLog('warning')
  }
  return logObj;
}

exports.logger = logger;