const Medicines = require(packageHelper.MODEL_CONFIG_DIR)['Medicines'];

require('./fetch_medicines')(Medicines);

module.exports = Medicines;
