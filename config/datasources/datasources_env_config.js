const packageHelper = require('../package_helper');
const datasources = require('./datasources');

let mysql_config = {};
let mongo_config = {};

switch (packageHelper.NODE_ENV) {
  case 'dev':
    mongo_config = {
      url: 'mongodb+srv://admin:Daressalam@defconone-ak0ki.mongodb.net/test?retryWrites=true&w=majority'
    }
    mysql_config = {
      database: datasources['dev'].mysql.database,
      username: datasources['dev'].mysql.username,
      password: datasources['dev'].mysql.password,
      host: datasources['dev'].mysql.host,
      options: {
        dialect: datasources['dev'].mysql.connector,
        host: datasources['dev'].mysql.host,
        port: datasources['dev'].mysql.port
      }
    };
    break;
  case 'uat':
    mongo_config = {
      url: 'mongodb+srv://admin:Daressalam@defconone-ak0ki.mongodb.net/test?retryWrites=true&w=majority'
    }
    mysql_config = {
      database: datasources['uat'].mysql.database,
      username: datasources['uat'].mysql.username,
      password: datasources['uat'].mysql.password,
      host: datasources['uat'].mysql.host,
      options: {
        dialect: datasources['uat'].mysql.connector,
        host: datasources['uat'].mysql.host,
        port: datasources['uat'].mysql.port
      }
    };
    break;
  case 'production':
    mongo_config = {
      url: 'mongodb+srv://admin:Daressalam@defconone-ak0ki.mongodb.net/test?retryWrites=true&w=majority'
    }
    mysql_config = {
      database: datasources['production'].mysql.database,
      username: datasources['production'].mysql.username,
      password: datasources['production'].mysql.password,
      host: datasources['production'].mysql.host,
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
    mongo_config = {
      url: 'mongodb+srv://admin:Daressalam@defconone-ak0ki.mongodb.net/test?retryWrites=true&w=majority'
    }
    mysql_config = {
      database: datasources['dev'].mysql.database,
      username: datasources['dev'].mysql.username,
      password: datasources['dev'].mysql.password,
      host: datasources['dev'].mysql.host,
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

module.exports = {
  mysql: mysql_config,
  mongo: mongo_config
};