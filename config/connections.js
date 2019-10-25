const datasources = require('./datasources');

let db_config = {};

switch (package_helper.NODE_ENV) {
  case 'dev':
    db_config = {
      db_name: datasources['dev'].mysql.database,
      user: datasources['dev'].mysql.user,
      password: datasources['dev'].mysql.password,
      options: {
        dialect: datasources['dev'].mysql.connector,
        host: datasources['dev'].mysql.host,
        port: datasources['dev'].mysql.port
      }
    };
    break;
  case 'uat':
    db_config = {
      db_name: datasources['uat'].mysql.database,
      user: datasources['uat'].mysql.user,
      password: datasources['uat'].mysql.password,
      options: {
        dialect: datasources['uat'].mysql.connector,
        host: datasources['uat'].mysql.host,
        port: datasources['uat'].mysql.port
      }
    };
    break;
  case 'production':
    db_config = {
      db_name: datasources['production'].mysql.database,
      user: datasources['production'].mysql.user,
      password: datasources['production'].mysql.password,
      options: {
        dialect: datasources['production'].mysql.connector,
        host: datasources['production'].mysql.host,
        port: datasources['production'].mysql.port
      }
    };
    break;
  default:
    db_config = {
      db_name: datasources['dev'].mysql.database,
      user: datasources['dev'].mysql.user,
      password: datasources['dev'].mysql.password,
      options: {
        dialect: datasources['dev'].mysql.connector,
        host: datasources['dev'].mysql.host,
        port: datasources['dev'].mysql.port,
        pool: {
          max: 30,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    };
    break;
}

const Sequelize = new package_helper.sequelize(db_config.db_name, db_config.user, db_config.password, db_config.options);

Sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    global.sequelize = Sequelize;
  })
  .catch(err => {
    console.error('Unable to connect to the mysql database:');
    console.dir(err);
  });

module.exports = Sequelize;
