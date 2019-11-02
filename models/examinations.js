class Examinations extends sequelize.Model {}

Examinations.init({
  examination_id: {
    type: sequelize.BIGINT(11),
    primaryKey: true,
    allowNull: false
  },
  examination_name: {
    type: sequelize.STRING(50),
    allowNull: true
  },
  examination_code: {
    type: sequelize.STRING(50),
    allowNull: true
  },
  examination_description: {
    type: sequelize.STRING(100),
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
  modelName: 'Examinations',
  freezeTableName: true
});

module.exports = Examinations;