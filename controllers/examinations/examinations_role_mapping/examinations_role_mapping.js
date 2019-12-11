const log = require('../../../config/log_config').logger('examinations_role_mapping_controller');
const ExaminationsRoleMapping = require(packageHelper.MODEL_CONFIG_DIR)['ExaminationsRoleMapping'];

ExaminationsRoleMapping.fetchExaminationsRoleMapping = (req, res) => {

  let whereObj = Object.assign({}, req.params, {
    where: {
      role_id: req.user.role_id
    },
    include: [{
      model: models['Examinations'],
      as: 'examination'
    }, {
      model: models['Roles'],
      as: 'role'
    }]
  });
  models['ExaminationsRoleMapping'].scope('activeScope').findAll(whereObj)
    .then(fetch_res => {
      log.info('---ExaminationsRoleMapping_FETCH_SUCCESS---');
      log.info(fetch_res);
      return res.send({
        success: true,
        message: 'examinations Role Mapping fetching success',
        data: {
          examinations_role_mapping: fetch_res
        }
      });
    })
    .catch(fetch_err => {
      log.info('---ExaminationsRoleMapping_FETCH_FAILURE---');
      log.info(fetch_err);
      return res.status(500).send({
        success: false,
        message: 'examinations Role Mapping fetching failure',
        data: {
          examinations_role_mapping: fetch_err
        }
      });
    });
}

ExaminationsRoleMapping.createExaminationsRoleMapping = (req, res) => {

  let createObj = Object.assign({}, req.body);
  models.ExaminationsRoleMapping.create(createObj)
    .then(create_res => {
      log.info('---ExaminationsRoleMapping_CREATION_SUCCESS---');
      log.info(create_res);
      return res.send({
        success: true,
        message: 'examinations Role Mapping creation success',
        data: {
          examinations_role_mapping: create_res.toJSON()
        }
      });
    })
    .catch(create_err => {
      log.info('---ExaminationsRoleMapping_CREATION_FAILURE---');
      log.info(create_err);
      return res.send({
        success: false,
        message: 'examinations Role Mapping creation failure',
        data: {
          examinations_role_mapping: create_err
        }
      });
    });
}

module.exports = ExaminationsRoleMapping;