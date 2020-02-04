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
  // sessionCheckerFunction: async (req, res) => {
  //   if (req.session.user && req.cookies.defcon_one_sid) {
  //     next();
  //   } else {
  //     next();
  //   }
  // },
  generateToken: async (req, res) => {
    try {
      if (req.user) {
        jwt.sign({
          username: req.user.username
        }, SECRET_KEY + req.user.username, (err, token) => {
          if (err) {
            log.error('---GENERATETOKEN_ERROR---');
            log.error(err);
            return utils.generateResponse(PERMISSION_DENIED)(res);
          } else {
            let data_Obj = {
              access_token: token,
              username: req.body.username
            };
            AccessToken.generateAccessToken(data_Obj)
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
    } catch (error) {
      log.error('---ERROR_CAUGHT---');
      log.error(error);
      return utils.generateResponse(INTERNAL_SERVER_ERROR)(res);
    }
  },

  validateUser: async (req, res, next) => {
    try {
      //find the user from users model
      let where_Obj = {
        username: utils.validateKeys(() => req.body.username, req.body.mobile_no + DEFAULT_USERNAME, null),
      }
      Users.findOne(where_Obj)
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
    } catch (error) {
      log.error('---ERROR_CAUGHT---');
      log.error(error);
      return utils.generateResponse(INTERNAL_SERVER_ERROR)(res);
    }
  },

  ensureAuth: async (req, res, next) => {
    try {
      console.log(req.isAuthenticated());
      if (req.isAuthenticated()) {
        return next();
      } else {
        return utils.generateResponse(PERMISSION_DENIED)(res);
      }
    } catch (error) {
      log.error('---ERROR_CAUGHT---');
      log.error(error);
      return utils.generateResponse(INTERNAL_SERVER_ERROR)(res);
    }
  },

  verifyToken: async (req, res, next) => {
    try {
      //GET AUTH HEADER VALUE
      const bearer_token = req.headers['authorization'];
      if (bearer_token) {
        req.token = bearer_token;
        let req_Obj = {
          authorization: req.token
        };
        AccessToken.getAccessToken(req_Obj)
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
    } catch (error) {
      log.error('---ERROR_CAUGHT---');
      log.error(error);
      return utils.generateResponse(INTERNAL_SERVER_ERROR)(res);
    }
  },

  attachUserToRequest: async (req, res, next) => {
    try {
      let filterUser_Obj = {
        username: req.username
      };
      Users.findOne(filterUser_Obj)
        .then(userDetails => {
          log.info('---userDetails---');
          log.info(userDetails);
          if (userDetails) {
            req.user = userDetails;
            let where_Obj = {
              where: {
                role_type: userDetails.role_type
              }
            };
            models['Roles'].findOne(where_Obj)
              .then(roleDetails => {
                if (roleDetails) {
                  req.user.role_id = roleDetails.role_id;
                  next();
                } else {
                  return utils.generateResponse(PERMISSION_DENIED)(res);
                }
              })
              .catch(user_Error => {
                log.error('---user_Error---');
                log.error(user_Error);
                return utils.generateResponse(PERMISSION_DENIED)(res);
              });
          } else {
            return utils.generateResponse(PERMISSION_DENIED)(res);
          }
        })
        .catch(user_Error => {
          log.error('---user_Error---');
          log.error(user_Error);
          return utils.generateResponse(PERMISSION_DENIED)(res);
        });
    } catch (error) {
      log.error('---ERROR_CAUGHT---');
      log.error(error);
      return utils.generateResponse(INTERNAL_SERVER_ERROR)(res);
    }
  },

  destroyToken: async (req, res, next) => {
    try {
      let token_Obj = {
        access_token: req.headers['authorization']
      };
      AccessToken.clearToken(token_Obj)
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
    } catch (error) {
      log.error('---ERROR_CAUGHT---');
      log.error(error);
      return utils.generateResponse(INTERNAL_SERVER_ERROR)(res);
    }
  }
}
