class Person extends sequelize.Model {}

Person.init({
  id: {
    type: sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: sequelize.STRING,
    allowNull: true
  },
  age: {
    type: sequelize.BIGINT,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'user'
});
