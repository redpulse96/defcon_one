const log = require('../../config/log_config').logger('helper_function');

module.exports = {
  to: promise => promise.then(data => ([null, data])).catch(err => ([err, null])),
  objectFn: {
    hasFunction: (obj, key) => {
      let isExists;
      obj[key] ? isExists = true : isExists = false;
      return isExists;
    }
  },
  arrayFn: {
    /**
     * @param {Array} arr - Array of objects to map a key from
     * @param {String} key - The attribute whose values are returned as an array
     */
    mapFunction: (arr, key) => {
      log.info('---mapFunction---');
      log.info(arr);
      let retArray = [];
      arr.forEach(v => {
        v[key] && retArray.push(v[key]);
      });
      return retArray;
    },
    /**
     * @param {Array} arr - Array of objects to group
     * @param {String} key - The attribute to group the list by
     */
    groupByFunction: (arr, key) => {
      let resObj = {};
      arr.forEach(v => {
        !(resObj[v[key]]) ? resObj[v[key]] = [v] : resObj[v[key]].push(v);
      });
      return resObj;
    }
  }
}