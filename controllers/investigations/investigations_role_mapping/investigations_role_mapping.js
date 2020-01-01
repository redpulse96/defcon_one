const log = require('../../../config/log_config').logger('investigations_role_mapping_controller');
const InvestigationsRoleMapping = require(packageHelper.MODEL_CONFIG_DIR)['InvestigationsRoleMapping'];

InvestigationsRoleMapping.fetchInvestigationsRoleMapping = (req, res) => {
  let whereObj = {
    where: {
      ...req.params,
      role_id: req.user.role_id
    },
    include: [{
      model: models['Investigations'],
      as: 'investigation'
    }, {
      model: models['Roles'],
      as: 'role'
    }]
  };
  models['InvestigationsRoleMapping']
    .scope('activeScope').findAll(whereObj)
    .then(fetchRes => {
      log.info('---InvestigationsRoleMapping_FETCH_SUCCESS---');
      log.info(fetchRes);
      return res.send({
        success: true,
        message: 'Investigations Role Mapping fetching success',
        data: {
          investigations_role_mapping: fetchRes
        }
      });
    })
    .catch(fetchErr => {
      log.info('---InvestigationsRoleMapping_FETCH_FAILURE---');
      log.info(fetchErr);
      return utils.generateResponse(IRM_FETCH_ERROR)(res);
      return res.status(500).send({
        success: false,
        message: 'Investigations Role Mapping fetching failure',
        data: {}
      });
    });
}

InvestigationsRoleMapping.createInvestigationsRoleMapping = (req, res) => {
  let createObj = {
    ...req.body
  };
  models.InvestigationsRoleMapping.create(createObj)
    .then(createRes => {
      log.info('---InvestigationsRoleMapping_CREATION_SUCCESS---');
      log.info(createRes);
      return res.send({
        success: true,
        message: 'Patient investigations Role Mapping creation success',
        data: {
          investigations_role_mapping: createRes.toJSON()
        }
      });
    })
    .catch(createErr => {
      log.info('---InvestigationsRoleMapping_CREATION_FAILURE---');
      log.info(createErr);
      return utils.generateResponse(IRM_CREATE_ERROR)(res);
      return res.send({
        success: false,
        message: 'Patient investigations Role Mapping creation failure',
        data: {}
      });
    });
}

module.exports = InvestigationsRoleMapping;