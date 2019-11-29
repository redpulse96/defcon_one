const Patients = require('../../models/patients/patients');

require('./fetch_patient')(Patients);
require('./create_patient')(Patients);
require('./update_patient')(Patients);

module.exports = Patients;