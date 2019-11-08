'use strict';

const path = packageHelper.path;
const Sequelize = packageHelper.sequelize;

const modelConfig = require('../model_config');
const mysqlConfig = require('./datasources_env_config')['mysql'];
const db = {};

let sequelize = new Sequelize(mysqlConfig.database, mysqlConfig.username, mysqlConfig.password, mysqlConfig.options);

for (let model_index = 0; model_index < Object.keys(modelConfig).length; model_index++) {
  const elem = Object.keys(modelConfig)[model_index];
  const model = sequelize['import'](path.join(packageHelper.DIRNAME, modelConfig[elem]));
  db[elem] = model;
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
