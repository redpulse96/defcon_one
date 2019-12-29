'use strict';

const path = packageHelper.path;
const mongoose = packageHelper.mongoose;
const Sequelize = packageHelper.sequelize;

const model_config = require('./model_config');
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

for (const model_key in model_config) {
  const elem = model_config[model_key];
  const model = sequelize['import'](path.join(packageHelper.DIRNAME, elem));
  db[model_key] = model;
}

for (const db_key in db) {
  if (db[db_key].associate) {
    db[db_key].associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
