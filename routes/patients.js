const express = packageHelper.express;
const router = express.Router();
const Patients = require('../controllers/patients/patients');

router.get('/patientsList', Patients.patientsList);
router.get('/patientDetails/:patient_id', Patients.patientDetails);
router.post('/createPatient', Patients.createPatient);
router.post('/updatePatient', Patients.updatePatientDetails);

module.exports = router;