const PatientSymptomsRoleMapping = require(packageHelper.MODEL_CONFIG_DIR)['PatientSymptomsRoleMapping'];

require('./create_patient_symptoms_role_mapping')(PatientSymptomsRoleMapping);
require('./fetch_patient_symptoms_role_mapping')(PatientSymptomsRoleMapping);

module.exports = PatientSymptomsRoleMapping;