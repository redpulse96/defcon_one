const log = require('../log_config').logger('auth_middleware');
const jwt = packageHelper.jsonwebtoken;

const validateUser = (req, res, next) => {
  //find the user from users model
  req.user = {
    user_id: 1,
    user_name: 'red.k@abc.com',
    password: 'daressalam'
  };
  next();
}

const generateToken = (req, res) => {
  if (req.user && req.headers.key) {
    jwt.sign({
      user: req.user
    }, req.headers['key'], (err, token) => {
      if (err) {
        log.error('---GENERATETOKEN_ERROR---');
        log.error(err);
        res.status(403).send({
          success: false,
          message: 'Permission denied',
          data: {}
        });
      } else {
        log.info('---TOKEN_GENERATED---');
        log.info(token);
        res.send({
          token
        });
      }
    });
  } else {
    log.error('---USER_DOES_NOT_EXIST---');
    res.status(403).send({
      success: false,
      message: 'Permission denied',
      data: {}
    });
  }
}

const verifyToken = (req, res, next) => {
  //GET AUTH HEADER VALUE
  const bearer_header = req.headers['authorization'];
  if(bearer_header) {
    const bearer_token = bearer_header;
    req.token = bearer_token;
    jwt.verify(req.token, req.headers['key'], (err, authData) => {
      if(err) {
        res.status(403).send({
          success: false,
          message: 'Permission denied',
          data: {}
        });
      } else {
        log.info('---TOKEN_VERIFIED---');
        log.info(authData);
        next();
      }
    });
  } else {
    //FORBIDDEN
    res.status(403).send({
      success: false,
      message: 'Permission denied',
      data: {}
    });
  }
}

module.exports = {
  validateUser,
  generateToken,
  verifyToken
}