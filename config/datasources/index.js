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
for (const model_index in modelConfig) {
  const elem = modelConfig[model_index];
  const model = sequelize['import'](path.join(packageHelper.DIRNAME, elem));
  db[model_index] = model;
}

for (const db_key in db) {
  if (db[db_key].associate) {
    db[db_key].associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
