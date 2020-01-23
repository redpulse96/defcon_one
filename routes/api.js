const express = packageHelper.express;
const router = express.Router();

const Appointments = require('./appointments');
const AppointmentLogs = require('./appointment_logs');
const AppointmentDiagnosisRoleMapping = require('./appointment_diagnosis_role_mapping');
const AppointmentExaminationsRoleMapping = require('./appointment_examinations_role_mapping');
const AppointmentInvestigationsRoleMapping = require('./appointment_investigations_role_mapping');
const AppointmentSymptomsRoleMapping = require('./appointment_symptoms_role_mapping');
const DiagnosisRoleMapping = require('./diagnosis_role_mapping');
const ExaminationsRoleMapping = require('./examinations_role_mapping');
const InvestigationsRoleMapping = require('./investigations_role_mapping');
const Medicines = require('./medicines');
const Patients = require('./patients');
const PatientPrescription = require('./patient_prescription');
const SymptomsRoleMapping = require('./symptoms_role_mapping');

router.use('/Appointments', Appointments);
router.use('/AppointmentLogs', AppointmentLogs);
router.use('/AppointmentDiagnosisRoleMapping', AppointmentDiagnosisRoleMapping);
router.use('/AppointmentExaminationsRoleMapping', AppointmentExaminationsRoleMapping);
router.use('/AppointmentInvestigationsRoleMapping', AppointmentInvestigationsRoleMapping);
router.use('/AppointmentSymptomsRoleMapping', AppointmentSymptomsRoleMapping);
router.use('/DiagnosisRoleMapping', DiagnosisRoleMapping);
router.use('/ExaminationsRoleMapping', ExaminationsRoleMapping);
router.use('/InvestigationsRoleMapping', InvestigationsRoleMapping);
router.use('/Medicines', Medicines);
router.use('/Patients', Patients);
router.use('/PatientPrescription', PatientPrescription);
router.use('/SymptomsRoleMapping', SymptomsRoleMapping);

module.exports = router;
