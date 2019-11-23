const { registerUser } = require('../controllers/users');
const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/login', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/register', (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/register', registerUser);

module.exports = router;
