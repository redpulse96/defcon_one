const {
  registerUser
} = require('../controllers/users');
const {
  validateUser,
  generateToken,
  // setCookieFunction,
  destroyToken
} = require('../config/middleware/auth_middleware');

const passport = packageHelper.passport;
const express = packageHelper.express;
const router = express.Router();

router.post('/register', registerUser);

router.post('/login', validateUser, (req, res, next) => {
  passport.authenticate('local', {
    failureRedirect: '/login'
  })(req, res, next)
}, generateToken);

router.post('/logout', destroyToken, (req, res) => {
  req.logout();
  res.status(200).send({
    success: true,
    message: 'Logout successfull',
    data: {}
  });
});

module.exports = router;
