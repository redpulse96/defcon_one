const express = packageHelper.express;
const router = express.Router();
const Medicines = require('../controllers/medicines/medicines');

router.get('/medicinesList', Medicines.medicinesList);

module.exports = router;