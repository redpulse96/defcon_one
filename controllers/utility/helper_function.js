const log = require('../../config/log_config').logger('helper_function');

module.exports = {
  to: promise => promise.then(data => ([null, data])).catch(err => ([err, null])),
  objectFn: {
    hasFn: (obj, key) => {
      let isExists;
      obj[key] ? isExists = true : isExists = false;
      return isExists;
    },
    /**
     * @param {Object} parentObj - Array of objects to group
     * @param {Object} childObj - Array of objects to group
     */
    hasFn: (parentObj, childObj) => {
      let rsltObj = {
        ...parentObj
      };
      for (const child_key in childObj) {
        rsltObj[child_key] ? rsltObj[child_key] = childObj[child_key] : null;
      }
      return rsltObj;
    }
  },
  arrayFn: {
    /**
     * @param {Array} arr - Array of objects to map a key from
     * @param {String} key - The attribute whose values are returned as an array
     */
    mapFn: (arr, key) => {
      log.info('---mapFn---');
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
    groupByFn: (arr, key) => {
      let resObj = {};
      arr.forEach(v => {
        !(resObj[v[key]]) ? resObj[v[key]] = [v] : resObj[v[key]].push(v);
      });
      return resObj;
    }
  }
}