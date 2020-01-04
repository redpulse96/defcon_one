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
    objectFnParent: this,
    /**
     * @param {Object} obj - Object to check the presence of the key
     * @param {String} key - Key to be checked if present in the object
     */
    has: (obj, key) => {
      let is_exists;
      obj[key] ? is_exists = true : is_exists = false;
      return is_exists;
    },
    /**
     * @param {Object} parent_obj - Parent object to be merged
     * @param {Object} child_obj - Child object to be merged
     */
    merge: (parent_obj, child_obj) => {
      let res_obj = {
        ...parent_obj,
        ...child_obj
      };
      return res_obj;
    },
    /**
     * @param {Object} obj - Object filtered where null || undefined values are omitted
     */
    compact: obj => {
      let res_obj = {
        ...obj
      }
      for (const key in res_obj) {
        !(res_obj[key]) ? (delete res_obj[key]) : res_obj[key] = obj[key];
      }
      return res_obj;
    },
    /**
     * @param {Object} obj - Object of values
     * @param {Array} filter_arr - Array of keys
     */
    omit: (obj, filter_arr) => {
      let res_obj = {
        ...obj
      };
      for (const x in obj) {
        filter_arr.indexOf(x) > -1 ? delete res_obj[x] : null;
      }
      return res_obj;
    },
    /**
     * @param {Object} obj - Object of values
     * @param {Array} filter_arr - Array of keys
     */
    pick: (obj, filter_arr) => {
      let res_obj = {
        ...obj
      };
      for (const x in obj) {
        filter_arr.indexOf(x) === -1 ? delete res_obj[x] : null;
      }
      return res_obj;
    }
  },
  /**
   * @param {Object} arrayFn - List of all the helper functions related to an array
   */
  arrayFn: {
    arrayFnParent: this,
    /**
     * @param {Array} arr - Array of objects to map a key from
     * @param {String} key - The attribute whose values are returned as an array
     */
    map: (arr, key) => {
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
    groupBy: (arr, key) => {
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
    differ: (main_arr, chk_arr) => {
      let res_arr = [];
      chk_arr.forEach(x => {
        (main_arr.indexOf(x) < 0) && res_arr.push(x);
      });
      return res_arr;
    },
    /**
     * @param {Array} fst_arr - First array
     * @param {Array} scnd_arr - Second array
     */
    concat: (fst_arr, scnd_arr) => {
      let res_arr = [...fst_arr];
      for (let x = 0; x < scnd_arr.length; x++) {
        res_arr.push(scnd_arr[x]);
      }
      return res_arr;
    },
    /**
     * @param {Array} arr - Input array
     * @param {Object} filter_obj - filter object
     */
    filter: (arr, filter_obj) => {
      let res_arr = [];
      arr.forEach(v => {
        let is_pushable;
        for (const k in filter_obj) {
          v[k] ? v[k] === filter_obj[k] ? is_pushable = true : is_pushable = false : is_pushable = false;
        }
        is_pushable ? res_arr.push(v) : null;
      });
      return res_arr;
    }
  }
}
