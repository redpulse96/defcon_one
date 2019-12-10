'use strict';

const path = packageHelper.path;
const Sequelize = packageHelper.sequelize;
const mongoose = packageHelper.mongoose;

const modelConfig = require('./model_config');
const mysql_config = require('./datasources_env_config')['mysql'];
const mongo_config = require('./datasources_env_config')['mongo'];

const db = {};

const sequelize = new Sequelize(mysql_config.database, mysql_config.username, mysql_config.password, mysql_config.options);
mongoose.connect(mongo_config.url, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})
.then(() => {
  console.log('Mongodb connection established');
})
.catch(err => console.error(err));

delete modelConfig['Users'];
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
