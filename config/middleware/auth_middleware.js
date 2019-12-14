const log = require('../log_config').logger('auth_middleware');
const AccessToken = require('../../controllers/access_token');
const Users = require('../../models/users');
const utils = require('../../controllers/utility/utils');

const bcrypt = packageHelper.bcrypt;
const jwt = packageHelper.jsonwebtoken;

const { DEFAULT_USERNAME } = require('../../public/javascripts/constants');
const { SECRET_KEY } = require('../../public/javascripts/constants');

const generateToken = (req, res) => {
  if (req.user) {
    jwt.sign({
      username: req.user.username
    }, SECRET_KEY + req.user.username, (err, token) => {
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
          .then(accessTokenRes => {
            log.info('---TOKEN_GENERATED---');
            log.info(token);
            accessTokenRes.data.access_token_res.user_details = req.user;
            utils.generateResponse(accessTokenRes)(res);
            // return res.send(accessTokenRes);
          })
          .catch(accessTokenErr => {
            log.info('---TOKEN_GENERATTION_FAILURE---');
            log.info(accessTokenErr);
            utils.generateResponse(accessTokenErr)(res);
            // return res.send(accessTokenErr);
          });
      }
    });
  } else {
    log.error('---USER_DOES_NOT_EXIST---');
    utils.generateResponse({
      error_code: 403,
      success: false,
      message: 'Permission denied',
      data: {}
    })(res);
  }
}

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
            req.session.messages = "Login successfull";
            req.session.authenticated = true;
            req.authenticated = true;
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
  const bearer_token = req.headers['authorization'];
  if (bearer_token) {
    req.token = bearer_token;
    let reqObj = {
      authorization: req.token
    };
    AccessToken.getAccessToken(reqObj)
    .then(tokenRes => {
      log.info('---tokenRes---');
      log.info(tokenRes);
      req.username = tokenRes.data.access_token_res.username;
      jwt.verify(req.token, SECRET_KEY + req.username, (err, authData) => {
        if (err) {
          return res.status(403).send({
            success: false,
            message: 'Permission denied',
            data: err
          });
        } else {
          log.info('---TOKEN_VERIFIED---');
          log.info(authData);
          next();
        }
      });
    })
    .catch(tokenErr => {
      log.info('---token_err---');
      log.info(tokenErr);
      return res.status(403).send({
        success: false,
        message: 'Permission denied',
        data: {}
      });
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
    username: req.username
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
  .then(tokenRes => {
    log.info('---tokenRes---');
    log.info(tokenRes);
    next();
  })
  .catch(tokenErr => {
    log.info('---token_err---');
    log.info(tokenErr);
    return res.status(500).send({
      success: false,
      message: 'Internal server error',
      data: {}
    });
  });
}

module.exports = {
  generateToken,
  validateUser,
  ensureAuth,
  verifyToken,
  attachUserToRequest,
  destroyToken
}