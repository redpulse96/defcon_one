const log = require('../../config/log_config').logger('roles_controller');
const Roles = require(packageHelper.MODEL_CONFIG_DIR)['Roles'];

Roles.getRoles = (req, res) => {
  log.info('----Roles.getRoles---');
  let whereObj = {
    where: {
      role: 'r_dentist'
    },
    include: [{
      model: models.SymptomsRoleMapping,
      as: 'symptoms_role_mapping'
    }]
  }
  models['Roles'].findAll(whereObj)
    .then(model_res => {
      log.info('---ROLES_RES---');
      log.info(model_res);
      res.send({
        success: true,
        message: 'Roles fetch success',
        data: {
          roles: model_res
        }
      });
    })
    .catch(err => {
      log.error('---ROLES_ERR---');
      log.error(err);
      res.send({
        success: false,
        message: 'Roles fetch failure',
        data: {
          roles: err
        }
      });
      next(err);
    })
}

module.exports = Roles;