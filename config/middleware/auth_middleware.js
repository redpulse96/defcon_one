const log = require('../log_config').logger('auth_middleware');
const AccessToken = require('../../controllers/access_token');
const Users = require('../../models/users');
const utils = require('../../controllers/utility/utils');
const bcrypt = packageHelper.bcrypt;
const jwt = packageHelper.jsonwebtoken;
const {
  SECRET_KEY,
  DEFAULT_USERNAME
} = require('../../public/javascripts/constants');
const {
  PERMISSION_DENIED,
  INCORRECT_USERNAME,
  INTERNAL_SERVER_ERROR
} = require('../response_config');

module.exports = {
  sessionCheckerFunction: (req, res) => {
    if (req.session.user && req.cookies.defcon_one_sid) {
      next();
    } else {
      next();
    }
  },
  setCookieFunction: (req, res) => {

  },
  generateToken: (req, res) => {
    if (req.user) {
      jwt.sign({
        username: req.user.username
      }, SECRET_KEY + req.user.username, (err, token) => {
        if (err) {
          log.error('---GENERATETOKEN_ERROR---');
          log.error(err);
          return utils.generateResponse(PERMISSION_DENIED)(res);
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
            })
            .catch(accessTokenErr => {
              log.info('---TOKEN_GENERATTION_FAILURE---');
              log.info(accessTokenErr);
              utils.generateResponse(accessTokenErr)(res);
            });
        }
      });
    } else {
      log.error('---USER_DOES_NOT_EXIST---');
      return utils.generateResponse(PERMISSION_DENIED)(res);
    }
  },

  validateUser: (req, res, next) => {
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
              return utils.generateResponse(INCORRECT_USERNAME)(res);
            }
          });
        } else {
          log.info('---INVALID_USER---');
          return utils.generateResponse(INCORRECT_USERNAME)(res);
        }
      })
      .catch(user_error => {
        log.error('---USER_ERROR---');
        log.error(user_error);
        return utils.generateResponse(INTERNAL_SERVER_ERROR)(res);
      });
  },

  ensureAuth: (req, res, next) => {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      return next();
    } else {
      return utils.generateResponse(PERMISSION_DENIED)(res);
    }
  },

  verifyToken: (req, res, next) => {
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
              return utils.generateResponse(PERMISSION_DENIED)(res);
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
          return utils.generateResponse(PERMISSION_DENIED)(res);
        });
    } else {
      // FORBIDDEN
      return utils.generateResponse(PERMISSION_DENIED)(res);
    }
  },

  attachUserToRequest: (req, res, next) => {
    let filterUserObj = {
      username: req.username
    };
    Users.findOne(filterUserObj)
      .then(userDetails => {
        log.info('---userDetails---');
        log.info(userDetails);
        if (userDetails) {
          req.user = userDetails;
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
                return utils.generateResponse(PERMISSION_DENIED)(res);
              }
            })
            .catch(userError => {
              log.error('---userError---');
              log.error(userError);
              return utils.generateResponse(PERMISSION_DENIED)(res);
            });
        } else {
          return utils.generateResponse(PERMISSION_DENIED)(res);
        }
      })
      .catch(userError => {
        log.error('---userError---');
        log.error(userError);
        return utils.generateResponse(PERMISSION_DENIED)(res);
      });
  },

  destroyToken: (req, res, next) => {
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
        return utils.generateResponse(INTERNAL_SERVER_ERROR)(res);
      });
  }
}
