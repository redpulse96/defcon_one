const PatientDiagnosisRoleMapping = require(packageHelper.MODEL_CONFIG_DIR)['PatientDiagnosisRoleMapping'];

require('./create_patient_diagnosis_role_mapping')(PatientDiagnosisRoleMapping);
require('./fetch_patient_diagnosis_role_mapping')(PatientDiagnosisRoleMapping);

module.exports = PatientDiagnosisRoleMapping;