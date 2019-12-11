const log = require('../log_config').logger('auth_middleware');
const AccessToken = require('../../controllers/access_token');
const Users = require('../../models/users');
const utils = require('../../controllers/utility/utils');

const bcrypt = packageHelper.bcrypt;
const jwt = packageHelper.jsonwebtoken;

const { DEFAULT_USERNAME } = require('../../public/javascripts/constants');
const { SECRET_KEY } = require('../../public/javascripts/constants');

const validateUser = (req, res, next) => {
  //find the user from users model
  let whereObj = {
    username: utils.validateKeys(() => req.body.username, req.body.mobile_no + DEFAULT_USERNAME, null),
  }
  Users.findOne(whereObj)
    .then(user_details => {
      if (user_details) {
        //Match password
        bcrypt.compare(req.body.password, user_details.password, (matchErr, isMatched) => {
          if (matchErr) throw matchErr;
          if (isMatched) {
            user_details = user_details.toJSON();
            log.info('---user_details---');
            log.info(user_details);
            return next();
          } else {
            return res.status(403).send({
              success: false,
              message: 'Incorrect username or password',
              data: {}
            });
          }
        });
      } else {
        log.info('---INVALID_USER---');
        return res.status(403).send({
          success: false,
          message: 'Invalid username or password',
          data: {}
        });
      }
    })
    .catch(user_error => {
      log.error('---USER_ERROR---');
      log.error(user_error);
      return res.status(500).send({
        success: false,
        message: 'Internal server error',
        data: {}
      });
    });
}

const generateToken = (req, res) => {
  if (req.user) {
    jwt.sign({
      username: req.user.username
    }, SECRET_KEY, (err, token) => {
      if (err) {
        log.error('---GENERATETOKEN_ERROR---');
        log.error(err);
        return res.status(403).send({
          success: false,
          message: 'Permission denied',
          data: {}
        });
      } else {
        let dataObj = {
          access_token: token,
          username: req.body.username
        };
        AccessToken.generateAccessToken(dataObj)
          .then(access_token_res => {
            log.info('---TOKEN_GENERATED---');
            log.info(token);
            access_token_res.data.user_details = req.user
            return res.send(access_token_res);
          })
          .catch(access_token_err => {
            log.info('---TOKEN_GENERATTION_FAILURE---');
            log.info(access_token_err);
            return res.send(access_token_err);
          });
      }
    });
  } else {
    log.error('---USER_DOES_NOT_EXIST---');
    return res.status(403).send({
      success: false,
      message: 'Permission denied',
      data: {}
    });
  }
}

const ensureAuth = (req, res, next) => {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(500).send({
      success: false,
      message: 'Permission denied',
      data: {}
    });
  }
}

const verifyToken = (req, res, next) => {
  //GET AUTH HEADER VALUE
  const bearer_token = req.headers['bearer_token'];
  if (bearer_token) {
    req.token = bearer_token;
    jwt.verify(req.token, SECRET_KEY, (err, authData) => {
      if (err) {
        return res.status(403).send({
          success: false,
          message: 'Permission denied',
          data: err
        });
      } else {
        log.info('---TOKEN_VERIFIED---');
        log.info(authData);
        let reqObj = {
          authorization: req.token
        };
        AccessToken.getAccessToken(reqObj)
        .then(token_res => {
          log.info('---token_res---');
          log.info(token_res);
          req.username = token_res.data.username;
          next();
        })
        .catch(token_err => {
          log.info('---token_err---');
          log.info(token_err);
          return res.status(403).send({
            success: false,
            message: 'Permission denied',
            data: {}
          });
        });
      }
    });
  } else {
    //FORBIDDEN
    return res.status(403).send({
      success: false,
      message: 'Permission denied',
      data: {}
    });
  }
}

const attachUserToRequest = (req, res, next) => {
  let filterUserObj = {
    where: {
      username: req.username
    }
  };
  Users.findOne(filterUserObj)
  .then(userDetails => {
    log.info('---userDetails---');
    log.info(userDetails);
    if (userDetails) {
      Object.assign(req.user, userDetails);
      let whereObj = {
        where: {
          role_type: userDetails.role_type
        }
      };
      models['Roles'].findOne(whereObj)
      .then(roleDetails => {
        if (roleDetails) {
          req.user.role_id = roleDetails.role_id;
          next();
        } else {
          return res.status(400).send({
            success: false,
            message: 'Permission denied',
            data: {}
          });
        }
      })
      .catch(userError => {
        log.error('---userError---');
        log.error(userError);
        return res.status(400).send({
          success: false,
          message: 'Permission denied',
          data: {}
        });
      });
    } else {
      return res.status(400).send({
        success: false,
        message: 'Permission denied',
        data: {}
      });
    }
  })
  .catch(userError => {
    log.error('---userError---');
    log.error(userError);
    return res.status(400).send({
      success: false,
      message: 'Permission denied',
      data: {}
    });
  });
}

const destroyToken = (req, res, next) => {
  let tokenObj = {
    access_token: req.headers['authorization']
  };
  AccessToken.clearToken(tokenObj)
  .then(token_res => {
    log.info('---token_res---');
    log.info(token_res);
    next();
  })
  .catch(token_err => {
    log.info('---token_err---');
    log.info(token_err);
    return res.status(500).send({
      success: false,
      message: 'Internal server error',
      data: {}
    });
  });
}

module.exports = {
  validateUser,
  generateToken,
  ensureAuth,
  verifyToken,
  attachUserToRequest,
  destroyToken
}