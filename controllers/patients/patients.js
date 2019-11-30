const Patients = require(packageHelper.MODEL_CONFIG_DIR)['Patients'];

require('./fetch_patient')(Patients);
require('./create_patient')(Patients);
require('./update_patient')(Patients);

module.exports = Patients;