const log = require('../config/log_config').logger('access_token_controller');
const AccessToken = require(packageHelper.MODEL_CONFIG_DIR)['AccessToken'];

AccessToken.generateAccessToken = data => {
  return new Promise((resolve, reject) => {
    let createObj = {
      access_token: data.access_token,
      username: data.username
    };
    models['AccessToken'].create(createObj)
      .then(res => {
        log.info('---ACCESS_TOKEN_CREATION_SUCCESS---');
        log.info(res);
        return resolve({
          success: true,
          message: 'login successfull',
          data: {
            access_token_res: res.toJSON()
          }
        });
      })
      .catch(err => {
        log.error('---ACCESS_TOKEN_CREATION_FAILURE---');
        log.error(err);
        return reject({
          success: false,
          message: 'access token creation failure',
          data: err
        });
      });
  });
};

AccessToken.getAccessToken = data => {
  return new Promise((resolve, reject) => {
    log.info('----AccessToken.getAccessToken---');
    let whereObj = {
      where: {
        access_token: data.authorization
      }
    };
    models['AccessToken'].scope('activeScope').findOne(whereObj)
      .then(modelRes => {
        log.info('---GET_ACCESS_TOKENRes---');
        log.info(modelRes);
        if (modelRes) {
          return resolve({
            success: true,
            message: 'AccessToken fetch success',
            data: {
              access_token_res: modelRes
            }
          });
        } else {
          return reject({
            success: false,
            message: 'Bad request',
            data: {}
          });
        }
      })
      .catch(err => {
        log.error('---GET_ACCESS_TOKEN_ERR---');
        log.error(err);
        return reject({
          success: false,
          message: 'AccessToken fetch failure',
          data: {
            access_token: err
          }
        });
      });
  });
};

AccessToken.clearToken = data => {
  return new Promise((resolve, reject) => {
    let updateObj = {
      is_active: false,
      is_archived: true
    };
    let whereObj = {
      where: {
        access_token: data.access_token,
        is_active: true,
        is_archived: false
      }
    };
    models['AccessToken'].update(updateObj, whereObj)
      .then(res => {
        log.info('---ACCESS_TOKEN_DESTROYED_SUCCESS---');
        log.info(res);
        resolve({
          success: true,
          message: 'access token destroyed successfully',
          data: res
        });
      })
      .catch(err => {
        log.error('---ACCESS_TOKEN_DESTROYED_FAILURE---');
        log.error(err);
        reject({
          success: false,
          message: 'Something went wrong while destroying the access token',
          data: err
        });
      });
  });
};

module.exports = AccessToken;
