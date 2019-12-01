const express = packageHelper.express;
const router = express.Router();

const Appointments = require('../controllers/appointments/appointments');
const AppointmentLogs = require('../controllers/appointments/appointment_logs/appointment_logs')

const DiagnosisRoleMapping = require('../controllers/diagnosis/diagnosis_role_mapping/diagnosis_role_mapping');
const ExaminationsRoleMapping = require('../controllers/examinations/examinations_role_mapping/examinations_role_mapping');
const InvestigationsRoleMapping = require('../controllers/investigations/investigations_role_mapping/investigations_role_mapping');
const SymptomsRoleMapping = require('../controllers/symptoms/symptoms_role_mapping/symptoms_role_mapping');

const Patients = require('../controllers/patients/patients');
const PatientDiagnosisRoleMapping = require('../controllers/patients/patient_diagnosis_role_mapping/patient_diagnosis_role_mapping');
const PatientExaminationsRoleMapping = require('../controllers/patients/patient_examinations_role_mapping/patient_examinations_role_mapping');
const PatientInvestigationsRoleMapping = require('../controllers/patients/patient_investigations_role_mapping/patient_investigations_role_mapping');
const PatientSymptomsRoleMapping = require('../controllers/patients/patient_symptoms_role_mapping/patient_symptoms_role_mapping');
const PatientPrescription = require('../controllers/patients/patients_prescription/patient_prescription');

router.get('/Appointments/statusBasedAppointments/:user_id/:custom_date', Appointments.statusBasedAppointments);
router.post('/Appointments/createAppointments', Appointments.createAppointment);
router.post('/Appointments/appointmentFulfilment', Appointments.appointmentFulfilment);

router.get('/AppointmentLogs/fetchAppointmentLogs', AppointmentLogs.fetchAppointmentLogs);

router.get('/DiagnosisRoleMapping/fetchDiagnosisRoleMapping', DiagnosisRoleMapping.fetchDiagnosisRoleMapping);
router.post('/DiagnosisRoleMapping/createDiagnosisRoleMapping', DiagnosisRoleMapping.createDiagnosisRoleMapping);

router.get('/ExaminationsRoleMapping/fetchExaminationsRoleMapping', ExaminationsRoleMapping.fetchExaminationsRoleMapping);
router.post('/ExaminationsRoleMapping/createExaminationsRoleMapping', ExaminationsRoleMapping.createExaminationsRoleMapping);

router.get('/InvestigationsRoleMapping/fetchInvestigationsRoleMapping', InvestigationsRoleMapping.fetchInvestigationsRoleMapping);
router.post('/InvestigationsRoleMapping/createInvestigationsRoleMapping', InvestigationsRoleMapping.createInvestigationsRoleMapping);

router.get('/SymptomsRoleMapping/fetchSymptomsRoleMapping', SymptomsRoleMapping.fetchSymptomsRoleMapping);
router.post('/SymptomsRoleMapping/createSymptomsRoleMapping', SymptomsRoleMapping.createSymptomsRoleMapping);

router.get('/Patients/patientsList', Patients.patientsList);
router.get('/Patients/patientDetails/:patient_id', Patients.patientDetails);
router.post('/Patients/createPatients', Patients.createPatients);
router.post('/Patients/updatePatient', Patients.updatePatientDetails);

router.get('/PatientDiagnosisRoleMapping/fetchPatientDiagnosisRoleMapping', PatientDiagnosisRoleMapping.fetchPatientDiagnosisRoleMapping);
router.post('/PatientDiagnosisRoleMapping/createPatientDiagnosisRoleMapping', PatientDiagnosisRoleMapping.createPatientDiagnosisRoleMapping);

router.get('/PatientExaminationsRoleMapping/fetchPatientExaminationsRoleMapping', PatientExaminationsRoleMapping.fetchPatientExaminationsRoleMapping);
router.post('/PatientExaminationsRoleMapping/createPatientExaminationsRoleMapping', PatientExaminationsRoleMapping.createPatientExaminationsRoleMapping);

router.get('/PatientInvestigationsRoleMapping/fetchPatientInvestigationsRoleMapping', PatientInvestigationsRoleMapping.fetchPatientInvestigationsRoleMapping);
router.post('/PatientInvestigationsRoleMapping/createPatientInvestigationsRoleMapping', PatientInvestigationsRoleMapping.createPatientInvestigationsRoleMapping);

router.get('/PatientSymptomsRoleMapping/fetchPatientSymptomsRoleMapping', PatientSymptomsRoleMapping.fetchPatientSymptomsRoleMapping);
router.post('/PatientSymptomsRoleMapping/createPatientSymptomsRoleMapping', PatientSymptomsRoleMapping.createPatientSymptomsRoleMapping);

router.post('/PatientPrescription/createPatientPrescription', PatientPrescription.createPatientPrescription);

module.exports = router;
