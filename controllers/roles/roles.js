const log = require('../../config/log_config').logger('roles_controller');
const Roles = require(packageHelper.MODEL_CONFIG_DIR)['Roles'];

Roles.getRoles = data => {
  return new Promise((resolve, reject) => {
    log.info('----Roles.getRoles---');
    let where_Obj = {
      where: {
        ...data
      },
      include: [{
        model: models.SymptomsRoleMapping,
        as: 'symptoms_role_mapping'
      }]
    }
    models['Roles'].findAll(where_Obj)
      .then(modelRes => {
        log.info('---ROLESRes---');
        log.info(modelRes);
        return resolve({
          success: true,
          message: 'Roles fetch success',
          data: {
            roles: modelRes
          }
        });
      })
      .catch(modelErr => {
        log.error('---ROLES_ERR---');
        log.error(modelErr);
        return reject({
          success: false,
          message: 'Roles fetch failure',
          data: {}
        });
      });
  });
}

module.exports = Roles;
