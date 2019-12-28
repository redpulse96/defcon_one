const log = require('./log_config')('passport');
const Users = require('../models/users');

const localStrategy = packageHelper.passport_local.Strategy;
const bcrypt = packageHelper.bcrypt;

module.exports = passport => {
  passport.use(
    new localStrategy({
      usernameField: 'username'
    }, (username, password, done) => {
      // Match user
      Users.findOne({
        username
      })
        .then(userResult => {
          if (userResult.username) {
            // Match password
            bcrypt.compare(password, userResult.password, (matchErr, isMatched) => {
              if (matchErr) throw matchErr;
              if (isMatched) {
                userResult = userResult.toJSON();
                return done(null, {
                  _id: userResult._id,
                  name: userResult.name,
                  username: userResult.username,
                  mobile_no: userResult.mobile_no,
                  feature_rights: userResult.feature_rights,
                  role_type: userResult.role_type,
                  is_active: userResult.is_active,
                  is_archived: userResult.is_archived
                });
              } else {
                return done(null, false, 'Incorrect username or password');
              }
            });
          } else {
            return done(null, false, 'Invalid username');
          }
        })
        .catch(userErr => {
          log.error(userErr);
          return done(null, false, 'Invalid username');
        });
    })
  )

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    Users.findById(user._id, (err, userRes) => {
      done(err, userRes);
    });
  });
}