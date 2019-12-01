const { registerUser } = require('../controllers/users');
const { validateUser, generateToken, destroyToken } = require('../config/middleware/auth_middleware');

const express = packageHelper.express;
const router = express.Router();

router.post('/register', registerUser);

router.post('/login', (req, res) => {
  return res.send({
    "success": true,
    "message": "Patients fetching success",
    "data": {
      "patients": [{
        "patient_id": 1,
        "patient_name": "SYED REDHAN",
        "mobile_no": 7760225405,
        "phone_code": 91,
        "age": 22,
        "gender": "Male",
        "height": null,
        "weight": null,
        "blood_type": null,
        "date_of_birth": "1996-11-27T00:00:00.000Z",
        "email": "smredhan02@gmail.com",
        "is_active": true,
        "is_archived": false,
        "created_date": "2019-11-15",
        "updated_date": "2019-11-15T15:34:59.000Z"
      }, {
        "patient_id": 2,
        "patient_name": "SYED RAHEEB",
        "mobile_no": 7795957942,
        "phone_code": 91,
        "age": 19,
        "gender": "Male",
        "height": null,
        "weight": null,
        "blood_type": null,
        "date_of_birth": "1996-11-27T00:00:00.000Z",
        "email": "smredhan02@gmail.com",
        "is_active": true,
        "is_archived": false,
        "created_date": "2019-11-15",
        "updated_date": "2019-11-15T15:34:59.000Z"
      }, {
        "patient_id": 3,
        "patient_name": "SYED RUWAIZ",
        "mobile_no": 9880669195,
        "phone_code": 91,
        "age": 24,
        "gender": "Male",
        "height": null,
        "weight": null,
        "blood_type": null,
        "date_of_birth": "1996-11-27T00:00:00.000Z",
        "email": "smredhan02@gmail.com",
        "is_active": true,
        "is_archived": false,
        "created_date": "2019-11-15",
        "updated_date": "2019-11-15T15:34:59.000Z"
      }]
    }
  });
});

// router.post('/login', validateUser, (req, res, next) => {
//   passport.authenticate('local', {
//     failureRedirect: '/login'
//   })(req, res, next)
// }, generateToken);

router.post('/logout', destroyToken, (req, res) => {
  req.logout();
  res.status(200).send({
    success: true,
    message: 'Logout successfull',
    data: {}
  });
});

module.exports = router;
