const log = require('../../config/log_config').logger('patients_controller');
const utils = require('../utility/utils');

module.exports = Patients => {

  Patients.patientsList = (req, res) => {
    let filterObj = Object.assign({}, {
      where: {
        created_by: {
          $in: utils.validateKeys(() => [req.user.username], [], null)
        }
      }
    });
    if (req.user.parent) {
      filterObj.where.created_by.$in.push(req.user.parent);
    }
    models['Patients'].scope('activeScope').findAll(filterObj)
      .then(patients_res => {
        log.info('---LIST_OF_PATIENTS_OF_THE_USER---');
        log.info(patients_res);
        if (patients_res && patients_res.length) {
          return res.send({
            success: true,
            message: 'Patients list fetch success',
            data: {
              patients_list: patients_res
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
      .catch(patients_err => {
        log.info('---LIST_OF_PATIENTS_ERROR---');
        log.info(patients_err);
        return res.status(500).send({
          success: false,
          message: 'Patients list fetch failure',
          data: {}
        });
      });
  }
}