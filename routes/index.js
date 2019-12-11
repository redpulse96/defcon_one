const express = packageHelper.express;
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Defcon_One'
  });
});

module.exports = router;
