const log = require('../../config/log_config').logger('medicines_controller');
const utils = require('../utility/utils');
const {
  INTERNAL_SERVER_ERROR
} = require('../../../config/response_config');

module.exports = Medicines => {
  Medicines.medicinesList = async (req, res) => {
    models['Medicines'].scope('activeScope').findAll()
      .then(medicinesListResult => {
        log.info('---medicinesListResult---');
        log.info(medicinesListResult);
        return utils.generateResponse(medicinesListResult)(res);
      })
      .catch(medicinesListError => {
        log.error('---medicinesListError---');
        log.error(medicinesListError);
        return utils.generateResponse(INTERNAL_SERVER_ERROR)(res);
      });
  }
}
