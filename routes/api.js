const express = packageHelper.express;
const router = express.Router();

const Appointments = require('./appointments');
const AppointmentLogs = require('./appointment_logs');
const DiagnosisRoleMapping = require('./diagnosis_role_mapping');
const ExaminationsRoleMapping = require('./examinations_role_mapping');
const InvestigationsRoleMapping = require('./investigations_role_mapping');
const SymptomsRoleMapping = require('./symptoms_role_mapping');
const Patients = require('./patients');
const AppointmentDiagnosisRoleMapping = require('./appointment_diagnosis_role_mapping');
const AppointmentExaminationsRoleMapping = require('./appointment_examinations_role_mapping');
const AppointmentInvestigationsRoleMapping = require('./appointment_investigations_role_mapping');
const AppointmentSymptomsRoleMapping = require('./appointment_symptoms_role_mapping');
const PatientPrescription = require('./patient_prescription');

router.use('/Appointments', Appointments);
router.use('/AppointmentLogs', AppointmentLogs);
router.use('/DiagnosisRoleMapping', DiagnosisRoleMapping);
router.use('/ExaminationsRoleMapping', ExaminationsRoleMapping);
router.use('/InvestigationsRoleMapping', InvestigationsRoleMapping);
router.use('/SymptomsRoleMapping', SymptomsRoleMapping);
router.use('/Patients', Patients);
router.use('/AppointmentDiagnosisRoleMapping', AppointmentDiagnosisRoleMapping);
router.use('/AppointmentExaminationsRoleMapping', AppointmentExaminationsRoleMapping);
router.use('/AppointmentInvestigationsRoleMapping', AppointmentInvestigationsRoleMapping);
router.use('/AppointmentSymptomsRoleMapping', AppointmentSymptomsRoleMapping);
router.use('/PatientPrescription', PatientPrescription);

module.exports = router;
