const log = require('./log_config').logger('passport');
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
        .then(user_Result => {
          if (user_Result.username) {
            // Match password
            bcrypt.compare(password, user_Result.password, (matchErr, isMatched) => {
              if (matchErr) throw matchErr;
              if (isMatched) {
                user_Result = user_Result.toJSON();
                return done(null, {
                  _id: user_Result._id,
                  name: user_Result.name,
                  username: user_Result.username,
                  mobile_no: user_Result.mobile_no,
                  feature_rights: user_Result.feature_rights,
                  role_type: user_Result.role_type,
                  is_active: user_Result.is_active,
                  is_archived: user_Result.is_archived
                });
              } else {
                return done(null, false, 'Incorrect username or password');
              }
            });
          } else {
            return done(null, false, 'Invalid username');
          }
        })
        .catch(user_Error => {
          log.error(user_Error);
          return done(null, false, 'Invalid username');
        });
    })
  )

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    Users.findById(user._id, (err, user_Result) => {
      done(err, user_Result);
    });
  });
}