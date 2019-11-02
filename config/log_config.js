const {
  createLogger,
  format,
  transports,
  info
} = packageHelper.winston;

generateLogger = (serviceName, level) => {

  let generateLogObj = {};
  switch (level) {
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
          new transports.File({
            filename: 'defcon_one_info.log',
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
            filename: 'defcon_one_error.log',
            level: 'error'
          })
        ]
      };
      break;
    default:
      break;
  }
  createLogger(generateLogObj);
}

const logger = (serviceName) => {
  const newLog = createLogger({
    level: 'info',
    format: format.combine(
      info(serviceName),
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.errors({
        stack: true
      }),
      format.splat(),
      format.json()
    ),
    defaultMeta: {
      service: serviceName || 'defcon_one'
    },
    transports: [
      new transports.File({
        filename: 'defcon_one_error.log',
        level: 'error' || 'warn'
      }),
      new transports.File({
        filename: 'defcon_one_crit.log',
        level: 'crit'
      }),
      new transports.File({
        filename: 'defcon_one_fatal.log',
        level: 'fatal'
      }),
      new transports.File({
        filename: 'defcon_one_info.log',
        level: 'info'
      }),
      new transports.File({
        filename: 'defcon_one_error.log',
        level: 'debug' || 'trace'
      })
    ]
  });

  let constructLog = (level) => {
    let levelName = level ? level : 'info';

    return (...args) => {
      try {
        newLog.log(levelName, ...args);
        // If we're not in production then **ALSO** log to the `console`
        // with the colorized simple format.
        if (packageHelper.NODE_ENV !== 'production') {
          newLog.add(new transports.Console({
            format: format.combine(
              format.colorize(),
              format.simple(),
              format.json()
            )
          }));
        }
      } catch (e) {
        console.log('ERROR IS ');
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