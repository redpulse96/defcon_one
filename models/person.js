class person extends sequelize.Model {}
person.init({
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  age: {
    type: Sequelize.BIGINT,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'user'
});
