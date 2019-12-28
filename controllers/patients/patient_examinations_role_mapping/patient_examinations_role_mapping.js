const PatientExaminationsRoleMapping = require(packageHelper.MODEL_CONFIG_DIR)['PatientExaminationsRoleMapping'];

require('./create_patient_examinations_role_mapping')(PatientExaminationsRoleMapping);
require('./fetch_patient_examinations_role_mapping')(PatientExaminationsRoleMapping);

module.exports = PatientExaminationsRoleMapping;