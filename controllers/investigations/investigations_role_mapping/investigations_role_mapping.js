const log = require('../../../config/log_config').logger('investigations_role_mapping_controller');
const InvestigationsRoleMapping = require(packageHelper.MODEL_CONFIG_DIR)['InvestigationsRoleMapping'];

InvestigationsRoleMapping.fetchInvestigationsRoleMapping = (req, res) => {

  let whereObj = Object.assign({}, req.params, {
    where: {
      role_id: req.user.role_id
    },
    include: [{
      model: models['Investigations'],
      as: 'investigation'
    }, {
      model: models['Roles'],
      as: 'role'
    }]
  });
  models.InvestigationsRoleMapping.findOne(whereObj)
    .then(fetch_res => {
      log.info('---InvestigationsRoleMapping_FETCH_SUCCESS---');
      log.info(fetch_res);
      return res.send({
        success: true,
        message: 'Investigations Role Mapping fetching success',
        data: {
          investigations_role_mapping: fetch_res
        }
      });
    })
    .catch(fetch_err => {
      log.info('---InvestigationsRoleMapping_FETCH_FAILURE---');
      log.info(fetch_err);
      return res.status(500).send({
        success: false,
        message: 'Investigations Role Mapping fetching failure',
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
      log.info('---InvestigationsRoleMapping_CREATION_SUCCESS---');
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
      log.info('---InvestigationsRoleMapping_CREATION_FAILURE---');
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