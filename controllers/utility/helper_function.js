const log = require('../../config/log_config').logger('helper_function');

module.exports = {
  to: promise => promise.then(data => ([null, data])).catch(err => ([err, null])),
  objectFn: {
    hasFn: (obj, key) => {
      let is_exists;
      obj[key] ? is_exists = true : is_exists = false;
      return is_exists;
    },
    /**
     * @param {Object} parent_obj - Array of objects to group
     * @param {Object} child_obj - Array of objects to group
     */
    mergeFn: (parent_obj, child_obj) => {
      let res_obj = {
        ...parent_obj,
        ...child_obj
      };
      return res_obj;
    }
  },
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
