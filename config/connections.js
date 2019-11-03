const datasources = require('./datasources');
const log = require('./log_config').logger('connections');

let dbConfig = {};

switch (packageHelper.NODE_ENV) {
  case 'dev':
    dbConfig = {
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
    dbConfig = {
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
    dbConfig = {
      db_name: datasources['production'].mysql.database,
      user: datasources['production'].mysql.user,
      password: datasources['production'].mysql.password,
      options: {
        dialect: datasources['production'].mysql.connector,
        host: datasources['production'].mysql.host,
        port: datasources['production'].mysql.port,
        pool: {
          max: 30,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    };
    break;
  default:
    dbConfig = {
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

const Sequelize = new packageHelper.sequelize(dbConfig.db_name, dbConfig.user, dbConfig.password, dbConfig.options);

Sequelize.authenticate()
  .then(() => {
    log.info('Connection has been established successfully.', 'fdsfgdsfds');
    global.sequelize = Sequelize;
  })
  .catch(err => {
    console.error('Unable to connect to the mysql database:');
    console.dir(err);
  });

module.exports = Sequelize;
