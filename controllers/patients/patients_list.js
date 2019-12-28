const log = require('../../config/log_config').logger('patients_controller');
const utils = require('../utility/utils');

module.exports = Patients => {

  Patients.patientsList = (req, res) => {
    let filterObj = {
      where: {
        created_by: {
          $in: utils.validateKeys(() => [req.user.username], [], null)
        }
      }
    };
    if (req.user.parent) {
      filterObj.where.created_by.$in.push(req.user.parent);
    }
    models['Patients'].scope('activeScope').findAll(filterObj)
      .then(patientsRes => {
        log.info('---LIST_OF_PATIENTS_OF_THE_USER---');
        log.info(patientsRes);
        if (patientsRes && patientsRes.length) {
          return res.send({
            success: true,
            message: 'Patients list fetch success',
            data: {
              patients_list: patientsRes
            }
          });
        } else {
          return res.status(500).send({
            success: false,
            message: 'No patients fetched',
            data: {}
          });
        }
      })
      .catch(patientsErr => {
        log.info('---LIST_OF_patientsErrOR---');
        log.info(patientsErr);
        return res.status(500).send({
          success: false,
          message: 'Patients list fetch failure',
          data: {}
        });
      });
  }
}