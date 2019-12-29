const log = require('../../config/log_config').logger('helper_function');

module.exports = {
  /**
   * @param {Promise} promise - Takes a promise to be fulfilled
   */
  to: promise => promise.then(data => ([null, data])).catch(err => ([err, null])),
  /**
   * @param {Object} objectFn - List of all the helper functions related to an object
   */
  objectFn: {
    /**
     * @param {Object} obj - Object to check the presence of the key
     * @param {String} key - Key to be checked if present in the object
     */
    hasFn: (obj, key) => {
      let is_exists;
      obj[key] ? is_exists = true : is_exists = false;
      return is_exists;
    },
    /**
     * @param {Object} parent_obj - Parent object to be merged
     * @param {Object} child_obj - Child object to be merged
     */
    mergeFn: (parent_obj, child_obj) => {
      let res_obj = {
        ...parent_obj,
        ...child_obj
      };
      return res_obj;
    }
  },
  /**
   * @param {Object} arrayFn - List of all the helper functions related to an array
   */
  arrayFn: {
    /**
     * @param {Array} arr - Array of objects to map a key from
     * @param {String} key - The attribute whose values are returned as an array
     */
    mapFn: (arr, key) => {
      log.info('---mapFunction---');
      log.info(arr);
      let res_array = [];
      arr.forEach(v => {
        v[key] && res_array.push(v[key]);
      });
      return res_array;
    },
    /**
     * @param {Array} arr - Array of objects to group
     * @param {String} key - The attribute to group the list by
     */
    groupByFn: (arr, key) => {
      let res_obj = {};
      arr.forEach(v => {
        !(res_obj[v[key]]) ? (res_obj[v[key]] = [v]) : res_obj[v[key]].push(v);
      });
      return res_obj;
    },
    /**
     * @param {Array} main_arr - Array of key elements
     * @param {Array} chk_arr - Array of key elements
     */
    differFn: (main_arr, chk_arr) => {
      let res_arr = [];
      chk_arr.forEach(x => {
        (main_arr.indexOf(x) < 0) && res_arr.push(x);
      });
      return res_arr;
    }
  }
}
