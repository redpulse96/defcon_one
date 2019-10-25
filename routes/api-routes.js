const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  let response = {
    errorCode: 500,
    Message: 'Permission denied',
    data: {}
  };
  res.send(response);
});

module.exports = router;
