const log = require('../config/log_config').logger('users_controller');
const DEFAULT_USERNAME = require('../public/javascripts/constants');
const FEAURE_RIGHTS = require('../public/javascripts/role_mapping');
const Users = require('../models/users');
const utils = require('./utility/utils');

const bcrypt = packageHelper.bcrypt;

Users.generateSalt = password => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(password, (err, salt) => {
      if (err) {
        log.error('---ERROR_WHILE_GENERATING_SALT---');
        log.error(err);
        return reject({
          success: false,
          message: 'Salt generation error',
          data: {}
        });
      } else {
        log.info('---SUCCESS_WHILE_GENERATING_SALT---');
        log.info(salt);
        return resolve({
          success: true,
          message: 'Salt generation success',
          data: {
            salt
          }
        });
      }
    });
  });
}

Users.generateHash = (password, salt) => {
  return new Promise((resolve, reject) => {
    bcrypt(password, salt, (err, hash) => {
      if (err) {
        log.error('---ERROR_WHILE_GENERATING_HASH---');
        log.error(err);
        return reject({
          success: false,
          message: 'Hash generation error',
          data: {}
        });
      } else {
        log.info('---SUCCESS_WHILE_GENERATING_HASH---');
        log.info(hash);
        return resolve({
          success: true,
          message: 'Hash generation success',
          data: {
            hash
          }
        });
      }
    });
  });
}

/**
 * @param {String} name - name of the user
 * @param {Number} role_type - role_type associated to the role of the user
 * @param {Number} mobile_no - Mobile number of the user
 * @param {String} username - username of the user to be created
 * @param {String} password - password of the user that should be encrypted and generated
 * @param {Array} associated_users - array of usernames of the current user that come under this user
 * @param {Array} feature_rights - this should be added based on the feature rights based on the roles of the users
 */
const registerUser = (req, res) => {
  const paramsObj = {
    data: req.body,
    mandatoryParams: ['name', 'mobile_no', 'role_type', 'password']
  }
  utils.hasMandatoryParams(paramsObj)
    .then(() => {
      req.body.username = req.body.username ? req.body.username : req.body.mobile_no + DEFAULT_USERNAME;
      Users.findOne({
          mobile_no: req.body.mobile_no,
          is_active: true,
          is_archived: false
        })
        .then(existingUser => {
          if (existingUser.username) {
            log.einfo('---USER_ALREADY_EXISTS---');
            log.info(existingUser);
            res.status(400).send({
              success: false,
              message: 'User already exists',
              data: {}
            });
          } else {
            let newUser = new User(Object.assign({}, req.body, {
              feature_rights: FEAURE_RIGHTS[req.body['role_type']],
              is_active: true,
              is_archived: false
            }));
            Users.generateSalt(newUser)
              .then(saltRes => {
                Users.generateHash(newUser.password, saltRes.data.salt)
                  .then(hashRes => {
                    log.info('---PASSWORD_HASHED_SUCCESS---');
                    newUser.password = hashRes.data.hash;
                    newUser.save()
                      .then(createdUserResult => {
                        log.info('---CREATED_USER_SUCCESS---');
                        log.info(createdUserResult);
                        res.send({
                          success: true,
                          message: 'User created successfully',
                          data: {
                            user: createdUserResult
                          }
                        });
                      })
                      .catch(createdUserError => {
                        log.error('---CREATED_USER_ERROR---');
                        log.error(createdUserError);
                        res.status(500).send({
                          success: false,
                          message: 'Internal server error',
                          data: {}
                        });
                      });
                  })
                  .catch(hashErr => {
                    log.error('---PASSOWRD_HASEHED_ERROR---');
                    log.error(hashErr);
                    res.status(500).send({
                      success: false,
                      message: 'Internal server error',
                      data: {}
                    });
                  });
              })
              .catch(saltErr => {
                log.error('---PASSOWRD_SALT_ERROR---');
                log.error(saltErr);
                res.status(500).send({
                  success: false,
                  message: 'Internal server error',
                  data: {}
                });
              });
          }
        })
        .catch(() => res.status(500).send({
          success: false,
          message: 'Internal server error',
          data: {}
        }));
    })
    .catch(paramError => {
      log.error('---INSUFFICIENT_PARAMETERS---');
      log.error(paramError);
      res.status(paramError.error_code).send(paramError);
    });
}

module.exports = {
  registerUser
}