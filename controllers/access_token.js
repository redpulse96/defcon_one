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
          data: res.toJSON()
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

AccessToken.getAccessToken = req => {
  return new Promise((resolve, reject) => {
    log.info('----AccessToken.getAccessToken---');
    let whereObj = {
      where: {
        access_token: req.authorization
      }
    };
    models['AccessToken'].scope('activeScope').find(whereObj)
      .then(model_res => {
        log.info('---ROLES_RES---');
        log.info(model_res);
        return resolve({
          success: true,
          message: 'AccessToken fetch success',
          data: {
            access_token: model_res
          }
        });
      })
      .catch(err => {
        log.error('---ROLES_ERR---');
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
        id: data.id
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
        })
      })
      .catch(err => {
        log.error('---ACCESS_TOKEN_DESTROYED_FAILURE---');
        log.error(err);
        reject({
          success: false,
          message: 'Something went wrong while destroying the access token',
          data: err
        })
      });
  });
};

module.exports = AccessToken;