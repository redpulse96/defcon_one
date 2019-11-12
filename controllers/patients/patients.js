const log = require('../../../config/components/log_config').logger('patients_controller');
const Patients = require('../../models/patients/patients');

Patients.fetchPatients = (req, res) => {

  let whereObj = Object.assign({}, req.params, {
    include: [{
      model: models.Patients,
      as: 'patient'
    }, {
      model: models.Roles,
      as: 'role'
    }]
  });
  models.Patients.findOne(whereObj)
    .then(fetch_res => {
      log.info('---PATIENTS_FETCH_SUCCESS---');
      log.info(fetch_res);
      return res.send({
        success: true,
        message: 'Patients Role Mapping fetching success',
        data: {
          patients_role_mapping: fetch_res
        }
      });
    })
    .catch(fetch_err => {
      log.info('---PATIENTS_FETCH_FAILURE---');
      log.info(fetch_err);
      return res.send({
        success: false,
        message: 'Patients Role Mapping fetching failure',
        data: {
          patients_role_mapping: fetch_err
        }
      });
    });
}

Patients.createPatients = (req, res) => {

  let createObj = Object.assign({}, req.body);
  models.Patients.create(createObj)
    .then(create_res => {
      log.info('---PATIENTS_CREATION_SUCCESS---');
      log.info(create_res);
      return res.send({
        success: true,
        message: 'Patients Role Mapping creation success',
        data: {
          patients_role_mapping: create_res.toJSON()
        }
      });
    })
    .catch(create_err => {
      log.info('---PATIENTS_CREATION_FAILURE---');
      log.info(create_err);
      return res.send({
        success: false,
        message: 'Patients Role Mapping creation failure',
        data: {
          patients_role_mapping: create_err
        }
      });
    });
}

module.exports = Patients;