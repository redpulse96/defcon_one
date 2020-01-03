const AppointmentDiagnosisRoleMapping = require(packageHelper.MODEL_CONFIG_DIR)['AppointmentDiagnosisRoleMapping'];

require('./create_appointment_diagnosis_role_mapping')(AppointmentDiagnosisRoleMapping);
require('./fetch_appointment_diagnosis_role_mapping')(AppointmentDiagnosisRoleMapping);

module.exports = AppointmentDiagnosisRoleMapping;