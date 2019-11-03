const _ = packageHelper.lodash;
const {
  createLogger,
  format,
  transports
} = packageHelper.winston;

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
        format: format.combine(
          format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
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
    case 'warn':
      generateLogObj = {
        defaultMeta: {
          level: 'warn',
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
            level: 'warn'
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
    warn: generateLogger(serviceName, 'warn'),
    trace: generateLogger(serviceName, 'trace'),
    crit: generateLogger(serviceName, 'crit'),
    fatal: generateLogger(serviceName, 'fatal')
  };

  let constructLog = (level) => {
    let levelName = level ? level : 'info';

    return (...args) => {
      try {
        newLog[levelName].log({
          service: serviceName,
          'level': levelName,
          'message': _.concat(...args),
          'timestamp': new Date()
        });

        if (packageHelper.NODE_ENV !== 'production') {
          newLog[levelName].add(new transports.Console({
            format: format.combine(
              format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
              }),
              format.errors({
                stack: true
              }),
              format.splat(),
              format.json(),
              format.simple()
            )
          }));
        }
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
    warn: constructLog('warn'),
    fatal: constructLog('fatal'),
    crit: constructLog('crit'),
  }
  return logObj;
}

exports.logger = logger;