const packageHelper = require('../package_helper');
const datasources = require('./datasources');
const operatorsAliases = require('./operator_aliasing');

let mysql_config = {};
let mongo_config = {};
let env = 'dev';

switch (packageHelper.NODE_ENV) {
case 'dev':
  env = 'dev';
  break;
case 'uat':
  env = 'uat';
  break;
case 'production':
  env = 'production';
  break;
default:
  env = 'dev';
  break;
}

mongo_config = {
  url: datasources[env].mongo.url
}
mysql_config = {
  database: datasources[env].mysql.database,
  username: datasources[env].mysql.username,
  password: datasources[env].mysql.password,
  host: datasources[env].mysql.host,
  options: {
    dialect: datasources[env].mysql.connector,
    host: datasources[env].mysql.host,
    port: datasources[env].mysql.port,
    operatorsAliases: operatorsAliases,
    logging: false,
    pool: {
      max: 30,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};

module.exports = {
  mysql: mysql_config,
  mongo: mongo_config
};
