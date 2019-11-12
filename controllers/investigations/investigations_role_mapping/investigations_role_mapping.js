const log = require('../../../config/components/log_config').logger('investigations_role_mapping_controller');
const InvestigationsRoleMapping = require('../../models/investigations_role_mapping/investigations_role_mapping');

InvestigationsRoleMapping.fetchInvestigationsRoleMapping = (req, res) => {

  let whereObj = Object.assign({}, req.params, {
    include: [{
      model: models.investigationsRoleMapping,
      as: 'investigations_role_mapping'
    }, {
      model: models.Roles,
      as: 'role'
    }]
  });
  models.InvestigationsRoleMapping.findOne(whereObj)
    .then(fetch_res => {
      log.info('---PATIENT_PRESCRIPTION_FETCH_SUCCESS---');
      log.info(fetch_res);
      return res.send({
        success: true,
        message: 'Patient investigations Role Mapping fetching success',
        data: {
          investigations_role_mapping: fetch_res
        }
      });
    })
    .catch(fetch_err => {
      log.info('---PATIENT_PRESCRIPTION_FETCH_FAILURE---');
      log.info(fetch_err);
      return res.send({
        success: false,
        message: 'Patient investigations Role Mapping fetching failure',
        data: {
          investigations_role_mapping: fetch_err
        }
      });
    });
}

InvestigationsRoleMapping.createInvestigationsRoleMapping = (req, res) => {

  let createObj = Object.assign({}, req.body);
  models.InvestigationsRoleMapping.create(createObj)
    .then(create_res => {
      log.info('---PATIENT_PRESCRIPTION_CREATION_SUCCESS---');
      log.info(create_res);
      return res.send({
        success: true,
        message: 'Patient investigations Role Mapping creation success',
        data: {
          investigations_role_mapping: create_res.toJSON()
        }
      });
    })
    .catch(create_err => {
      log.info('---PATIENT_PRESCRIPTION_CREATION_FAILURE---');
      log.info(create_err);
      return res.send({
        success: false,
        message: 'Patient investigations Role Mapping creation failure',
        data: {
          investigations_role_mapping: create_err
        }
      });
    });
}

module.exports = InvestigationsRoleMapping;