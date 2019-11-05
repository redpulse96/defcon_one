const log = require('../../config/components/log_config').logger('roles_controller');
const Roles = require('./roles');

Roles.getRoles = () => {
  log.info('----Roles.getRoles---');
  new Promise((resolve, reject) => {
    let whereObj = {
      where: {
        role: 'r_dentist'
      }
    }
    Roles.findAll(whereObj)
      .then(res => {
        log.info('---ROLES_RES---');
        log.info(res);
        resolve({
          success: true,
          message: 'Roles fetched successfully',
          data: res
        });
      })
      .catch(err => {
        log.error('---ROLES_ERR---');
        log.error(err);
        reject({
          success: false,
          message: 'Could not fetch the roles',
          data: err
        });
      })
  });
}

module.exports = Roles.getRoles;