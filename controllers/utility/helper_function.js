const log = require('../../config/log_config').logger('helper_function');

module.exports = {
  to: promise => promise.then(data => ([null, data])).catch(err => ([err, null])),
  arrayFn: {
    /**
     * @param {Array} arr - Array of objects to map a key from
     * @param {String} key - The attribute whose values are returned as an array
     */
    arrayMapFunction: (arr, key) => {
      log.info('---arrayMapFunction---');
      log.info(arr);
      let retArray = [];
      arr.forEach(v => {
        v[key] && retArray.push(v[key]);
      });
      return retArray;
    }
  }
}