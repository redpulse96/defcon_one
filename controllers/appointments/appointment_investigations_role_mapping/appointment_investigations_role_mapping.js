const AppointmentInvestigationsRoleMapping = require(packageHelper.MODEL_CONFIG_DIR)['AppointmentInvestigationsRoleMapping'];

require('./create_appointment_investigations_role_mapping')(AppointmentInvestigationsRoleMapping);
require('./fetch_appointment_investigations_role_mapping')(AppointmentInvestigationsRoleMapping);

module.exports = AppointmentInvestigationsRoleMapping;