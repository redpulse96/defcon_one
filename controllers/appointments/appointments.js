const Appointments = require(packageHelper.MODEL_CONFIG_DIR)['Appointments'];
const AppointmentLogs = require(packageHelper.MODEL_CONFIG_DIR)['AppointmentLogs'];

require('./create_appointment')(Appointments);
require('./status_based_appointments')(Appointments);
require('./appointment_fulfilment')(Appointments, AppointmentLogs);

module.exports = Appointments;
