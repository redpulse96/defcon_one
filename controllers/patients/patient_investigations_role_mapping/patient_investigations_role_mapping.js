const PatientInvestigationsRoleMapping = require(packageHelper.MODEL_CONFIG_DIR)['PatientInvestigationsRoleMapping'];

require('./create_patient_investigations_role_mapping')(PatientInvestigationsRoleMapping);
require('./fetch_patient_investigations_role_mapping')(PatientInvestigationsRoleMapping);

module.exports = PatientInvestigationsRoleMapping;