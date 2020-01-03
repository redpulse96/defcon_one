const AppointmentSymptomsRoleMapping = require(packageHelper.MODEL_CONFIG_DIR)['AppointmentSymptomsRoleMapping'];

require('./create_appointment_symptoms_role_mapping')(AppointmentSymptomsRoleMapping);
require('./fetch_appointment_symptoms_role_mapping')(AppointmentSymptomsRoleMapping);

module.exports = AppointmentSymptomsRoleMapping;