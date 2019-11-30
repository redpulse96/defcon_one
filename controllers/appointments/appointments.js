const Appointments = require(packageHelper.MODEL_CONFIG_DIR)['Appointments'];

require('./create_appointment')(Appointments);
require('./status_based_appointments')(Appointments);
require('./appointment_fulfilment')(Appointments);

module.exports = Appointments;
