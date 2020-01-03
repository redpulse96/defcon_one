const Patients = require(packageHelper.MODEL_CONFIG_DIR)['Patients'];

require('./patient_helper')(Patients);
require('./patients_list')(Patients);
require('./patient_details')(Patients);
require('./create_patient')(Patients);
require('./update_patient_details')(Patients);

module.exports = Patients;
