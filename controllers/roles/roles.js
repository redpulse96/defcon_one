const log = require('../../config/log_config').logger('roles_controller');
const Roles = require(packageHelper.MODEL_CONFIG_DIR)['Roles'];

Roles.getRoles = (req, res) => {
  log.info('----Roles.getRoles---');
  let whereObj = {
    where: {
      role_type: 'r_dentist'
    },
    include: [{
      model: models.SymptomsRoleMapping,
      as: 'symptoms_role_mapping'
    }]
  }
  models['Roles'].findAll(whereObj)
    .then(modelRes => {
      log.info('---ROLESRes---');
      log.info(modelRes);
      return res.send({
        success: true,
        message: 'Roles fetch success',
        data: {
          roles: modelRes
        }
      });
    })
    .catch(err => {
      log.error('---ROLES_ERR---');
      log.error(err);
      return res.send({
        success: false,
        message: 'Roles fetch failure',
        data: {
          roles: err
        }
      });
    })
}

module.exports = Roles;