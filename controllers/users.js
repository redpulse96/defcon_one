const log = require('../config/log_config').logger('users_controller');
const Users = require('../models/users');
const utils = require('./utility/utils');
const {
  DEFAULT_SALT,
  DEFAULT_USERNAME,
  MANDATORY_PARAMS: {
    REGISTER_USER
  }
} = require('../public/javascripts/constants');
const {
  INSUFFICIENT_PARAMS,
  INTERNAL_SERVER_ERROR,
  USER_EXISTS
} = require('../config/response_config');
const FEAURE_RIGHTS = require('../public/javascripts/role_mapping');
const bcrypt = packageHelper.bcrypt;

Users.generateSalt = () => {
  new Promise((resolve, reject) => {
    bcrypt.genSalt(DEFAULT_SALT, (err, salt) => {
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
    bcrypt.hash(password, salt, (err, hash) => {
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
  let newUser;
  let paramsObj = {
    data: req.body,
    mandatoryParams: REGISTER_USER
  };
  utils.hasMandatoryParams(paramsObj)
    .then(() => {
      req.body.username = req.body.username ? req.body.username : req.body.mobile_no + DEFAULT_USERNAME;
      return Users.findOne({
        mobile_no: req.body.mobile_no,
        is_active: true,
        is_archived: false
      });
    })
    .then(existingUser => {
      if (existingUser) {
        log.info('---USER_ALREADY_EXISTS---');
        log.info(existingUser);
        return utils.generateResponse(USER_EXISTS)(res);
      } else {
        newUser = new Users({
          ...req.body,
          feature_rights: FEAURE_RIGHTS[req.body['role_type']].FEATURE_RIGHTS,
          is_active: true,
          is_archived: false
        });
        return Users.generateSalt(newUser);
      }
    })
    .then(saltRes => {
      return Users.generateHash(newUser.password, saltRes.data.salt);
    })
    .then(hashRes => {
      log.info('---PASSWORD_HASHED_SUCCESS---');
      newUser.password = hashRes.data.hash;
      return newUser.save();
    })
    .then(createdUserResult => {
      log.info('---CREATED_USER_SUCCESS---');
      log.info(createdUserResult);
      return res.status(200).send({
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
      return utils.generateResponse(INTERNAL_SERVER_ERROR)(res);
    })
    .catch(hashErr => {
      log.error('---PASSOWRD_HASEHED_ERROR---');
      log.error(hashErr);
      return utils.generateResponse(INTERNAL_SERVER_ERROR)(res);
    })
    .catch(saltErr => {
      log.error('---PASSOWRD_SALT_ERROR---');
      log.error(saltErr);
      return utils.generateResponse(INTERNAL_SERVER_ERROR)(res);
    })
    .catch((catchErr) => {
      log.error('---catchErr---');
      log.error(catchErr);
      return utils.generateResponse(INTERNAL_SERVER_ERROR)(res);
    })
    .catch(paramError => {
      log.error('---INSUFFICIENT_PARAMETERS---');
      log.error(paramError);
      return utils.generateResponse(INSUFFICIENT_PARAMS)(res);
    });
}

module.exports = {
  registerUser
}
