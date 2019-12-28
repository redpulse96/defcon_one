const Appointments = require(packageHelper.MODEL_CONFIG_DIR)['Appointments'];

require('./appointment_details')(Appointments);
require('./appointment_fulfilment')(Appointments);
require('./create_appointment')(Appointments);
require('./status_based_appointments')(Appointments);

module.exports = Appointments;
