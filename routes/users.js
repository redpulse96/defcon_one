const { registerUser } = require('../controllers/users');
const { validateUser, generateToken, destroyToken } = require('../config/middleware/auth_middleware');

const passport = packageHelper.passport;
const express = packageHelper.express;
const router = express.Router();

router.post('/register', registerUser);

// router.post('/login', (req, res) => {
//   return res.send({
//     "success": true,
//     "message": "login successfull",
//     "data": {
//       "id": 13,
//       "is_active": true,
//       "is_archived": false,
//       "created_date": "2019-12-10T18:21:03.075Z",
//       "updated_date": "2019-12-10T18:21:03.075Z",
//       "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRlbW9AZW1yLmluIiwiaWF0IjoxNTc2MDAyMDUzfQ.hpwyDKrO_k-qf8ny1FCCOcgPyGaZS6hsTfqLyBO4FmU",
//       "username": "demo@emr.in",
//       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRlbW9AZW1yLmluIiwiaWF0IjoxNTc2MDAyMDUzfQ.hpwyDKrO_k-qf8ny1FCCOcgPyGaZS6hsTfqLyBO4FmU",
//       "user_details": {
//         "feature_rights": [
//           1,
//           2,
//           3
//         ],
//         "is_active": true,
//         "is_archived": false,
//         "_id": "5dda246dc9c69021ea27cbc5",
//         "mobile_no": 7760225404,
//         "name": "DEMO TEST",
//         "role_type": "r_dentist",
//         "username": "demo@emr.in",
//         "password": "$2a$10$7eWmc4bEcDjJVtqWmZqOPuIBiDVAq1HavfqbaFfGVqzw/CDBiwSFa",
//         "date": "2019-11-24T06:34:21.991Z",
//         "__v": 0
//       }
//     }
//   });
// });

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
