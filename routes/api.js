const express = packageHelper.express;
const router = express.Router();

const Appointments = require('./appointments');
const AppointmentLogs = require('./appointment_logs');
const DiagnosisRoleMapping = require('./diagnosis_role_mapping');
const ExaminationsRoleMapping = require('./examinations_role_mapping');
const InvestigationsRoleMapping = require('./investigations_role_mapping');
const SymptomsRoleMapping = require('./symptoms_role_mapping');
const Patients = require('./patients');
const PatientDiagnosisRoleMapping = require('./patient_diagnosis_role_mapping');
const PatientExaminationsRoleMapping = require('./patient_examinations_role_mapping');
const PatientInvestigationsRoleMapping = require('./patient_investigations_role_mapping');
const PatientSymptomsRoleMapping = require('./patient_symptoms_role_mapping');
const PatientPrescription = require('./patient_prescription');

router.use('/Appointments', Appointments);
router.use('/AppointmentLogs', AppointmentLogs);
router.use('/DiagnosisRoleMapping', DiagnosisRoleMapping);
router.use('/ExaminationsRoleMapping', ExaminationsRoleMapping);
router.use('/InvestigationsRoleMapping', InvestigationsRoleMapping);
router.use('/SymptomsRoleMapping', SymptomsRoleMapping);
router.use('/Patients', Patients);
router.use('/PatientDiagnosisRoleMapping', PatientDiagnosisRoleMapping);
router.use('/PatientExaminationsRoleMapping', PatientExaminationsRoleMapping);
router.use('/PatientInvestigationsRoleMapping', PatientInvestigationsRoleMapping);
router.use('/PatientSymptomsRoleMapping', PatientSymptomsRoleMapping);
router.use('/PatientPrescription', PatientPrescription);

module.exports = router;
