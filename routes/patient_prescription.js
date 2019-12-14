const express = packageHelper.express;
const router = express.Router();
const PatientPrescription = require('../controllers/patients/patients_prescription/patient_prescription');

router.post('/createPatientPrescription', PatientPrescription.createPatientPrescription);

module.exports = router;