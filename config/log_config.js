const packageHelper = require('./package_helper');
const {
  createLogger,
  format,
  transports
} = packageHelper.winston;

const generateLogger = (serviceName, level) => {
  let levelName = level ? level : 'info';
  let generateLog_Obj = {};

  switch (levelName) {
    case 'info':
      generateLog_Obj = {
        defaultMeta: {
          level: 'info',
          service: serviceName || 'defcon_one'
        },
        transports: [
          new transports.Console({
            level: 'info',
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
          })
        ]
      };
      break;
    case 'error':
      generateLog_Obj = {
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
          new transports.Console({
            level: 'info',
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
          })
        ]
      };
      break;
    case 'debug':
      generateLog_Obj = {
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
            level: 'info',
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
          })
        ]
      };
      break;
    case 'warning':
      generateLog_Obj = {
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
            level: 'info',
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
          })
        ]
      };
      break;
    case 'trace':
      generateLog_Obj = {
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
            level: 'info',
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
          })
        ]
      };
      break;
    case 'crit':
      generateLog_Obj = {
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
          new transports.Console({
            level: 'info',
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
          })
        ]
      };
      break;
    default:
      generateLog_Obj = {
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
          new transports.Console({
            level: 'fatal',
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
          })
        ]
      };
      break;
  }
  return createLogger(generateLog_Obj);
}

const logger = serviceName => {
  const newLog = {
    info: generateLogger(serviceName, 'info'),
    error: generateLogger(serviceName, 'error'),
    trace: generateLogger(serviceName, 'trace'),
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

  let log_Obj = {
    info: constructLog('info'),
    error: constructLog('error'),
    trace: constructLog('trace'),
    debug: constructLog('debug'),
    warning: constructLog('warning')
  }
  return log_Obj;
}

exports.logger = logger;
