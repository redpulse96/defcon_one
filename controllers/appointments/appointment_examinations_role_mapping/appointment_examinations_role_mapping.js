const AppointmentExaminationsRoleMapping = require(packageHelper.MODEL_CONFIG_DIR)['AppointmentExaminationsRoleMapping'];

require('./create_appointment_examinations_role_mapping')(AppointmentExaminationsRoleMapping);
require('./fetch_appointment_examinations_role_mapping')(AppointmentExaminationsRoleMapping);

module.exports = AppointmentExaminationsRoleMapping;