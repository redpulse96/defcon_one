class Roles extends sequelize.Model {}

Roles.init({
  role_id: {
    type: sequelize.BIGINT(11),
    primaryKey: true,
    allowNull: false
  },
  role: {
    type: sequelize.ENUM,
    values: ['r_dentist','r_ortho'],
    allowNull: true
  },
  role_name: {
    type: sequelize.STRING,
    allowNull: true
  },
  role_code: {
    type: sequelize.STRING,
    allowNull: true
  },
  role_description: {
    type: sequelize.STRING,
    allowNull: true
  },
  is_active: {
    type: sequelize.BOOLEAN,

    defaultValue: true,
    allowNull: false
  },
  is_archived: {
    type: sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  created_date: {
    type: 'TIMESTAMP',
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: true
  },
  updated_date: {
    type: 'TIMESTAMP',
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'user'
});
