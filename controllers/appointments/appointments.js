const Appointments = require(packageHelper.MODEL_CONFIG_DIR)['Appointments'];

require('./fetch_appointment')(Appointments);
require('./create_appointment')(Appointments);
require('./status_based_appointments')(Appointments);

module.exports = Appointments;
