const log = require('../../config/log_config').logger('utils');
const _ = packageHelper.lodash;

module.exports = {
  /**
   * @param {Number} length - length of the reference id to be generated
   * @param {Char} chars - characters to be used for randomisation
   */
  GenerateUniqueID: (length, chars) => {
    let mask = '';
    let result = '';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9981212345';
    if (chars.indexOf('#') > -1) mask += '0123456789ASCDFGVBGASDWERTYUIOKJMNHG';
    if (chars.indexOf('a') > -1) mask += 'ABCDEZS0123456789FGTRESDF1234FGTSSDD';
    if (chars.indexOf('b') > -1) mask += '012345REWQ6789POIUYTASDFGHJKILOPHDWE';
    if (chars.indexOf('x') > -1) mask += 'asdfavsgqquioqkjakjsajkajsakjlajlsal';
    for (let i = length; i > 0; --i) {
      result += mask[Math.round(Math.random() * (mask.length - 1))];
    }
    return result;
  },
  /**
   * @param {String} data - function to run within try/catch for safe exception handling
   * @param {Array} mandatoryParams - array of keys that are checked against the data
   * isOptional will by default false and an error alert will be sent to slack. If passed as true, the functionality remains same but no alert will be sent to slack
   */
  hasMandatoryParams: (paramObj) => {
    return new Promise((resolve, reject) => {
      if (paramObj.mandatoryParams && paramObj.mandatoryParams.length) {
        let reqParams = Object.keys(paramObj.data);
        if (!_.difference(paramObj.mandatoryParams, reqParams).length) {
          log.info('All keys are present');
          log.info(paramObj);
          return resolve({
            success: true,
            message: 'All mandatory keys are present',
            data: paramObj.data
          });
        } else {
          log.error('---INSUFFICIENT_PARAMETERS---');
          log.error(_.difference(paramObj.mandatoryParams, reqParams));
          return reject({
            success: false,
            error_code: 400,
            message: 'Insufficient parameters',
            data: _.difference(paramObj.mandatoryParams, reqParams)
          });
        }
      }
      if (paramObj.checkValType && paramObj.checkValType.length) {
        paramObj.checkValType.forEach(val => {
          switch (val.checkValue.toUpperCase().trim()) {
            case 'ARRAY':
              if (!_.isArray(paramObj.data[val.key])) {
                return reject({
                  success: false,
                  error_code: 400,
                  message: 'Value type does not match',
                  data: val
                });
              }
              break;
            case 'STRING':
              if (!_.isString(paramObj.data[val.key])) {
                return reject({
                  success: false,
                  error_code: 400,
                  message: 'Value type does not match',
                  data: val
                });
              }
              break;
            case 'NUMBER':
              if (!_.isNumber(paramObj.data[val.key])) {
                return reject({
                  success: false,
                  error_code: 400,
                  message: 'Value type does not match',
                  data: val
                });
              }
              break
            case 'BOOLEAN':
              if (!_.isBoolean(paramObj.data[val.key])) {
                return reject({
                  success: false,
                  error_code: 400,
                  message: 'Value type does not match',
                  data: val
                });
              }
              break;
            default:
              return resolve({
                success: true,
                error_code: 400,
                message: 'Value type matches successfully',
                data: val
              });
          }
        });
      }
    });
  },
  /**
   *
   * @param {Function} fn - function to run within try/catch for safe exception handling
   * @param {any} defaultVal - default value to return in case of exception
   * @param {Callback} cb  - callback to invoke with error-first as argument in case of exception
   */
  validateKeys: (fn, defaultVal, cb) => {
    if (!cb) {
      cb = defaultVal;
    }
    try {
      return fn();
    } catch (e) {
      log.error('---ERROR_IN_VALIDATEKEYS_FUNC---', e);
      if (typeof cb === 'function')
        return cb(e);
      else
        return defaultVal;
    }
  }
}