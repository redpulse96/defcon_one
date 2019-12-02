const Users = require('../models/users');

const localStrategy = packageHelper.passport_local.Strategy;
const bcrypt = packageHelper.bcrypt;

module.exports = passport => {
  passport.use(
    new localStrategy({ usernameField: 'username' }, (username, password, done) => {
      // Match user
      Users.findOne({
        username
      })
      .then(userResult => {
        if(userResult.username) {
          // Match password
          bcrypt.compare(password, userResult.password, (matchErr, isMatched) => {
            if(matchErr) throw matchErr;
             if(isMatched) {
               userResult = userResult.toJSON();
               return done(null, userResult);
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
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    Users.findById(id, (err, user) => {
      done(err, user);
    });
  });
}