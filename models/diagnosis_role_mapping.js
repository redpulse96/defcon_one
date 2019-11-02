class DiagnosisRoleMapping extends sequelize.Model {}

DiagnosisRoleMapping.init({
  diagnosis_role_mapping_id: {
    type: sequelize.BIGINT(11),
    primaryKey: true,
    allowNull: false
  },
  diagnosis_id: {
    type: sequelize.BIGINT(1),
    allowNull: true
  },
  role_id: {
    type: sequelize.BIGINT(1),
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
  modelName: 'diagnosis_role_mapping',
  freezeTableName: true
});

module.exports = DiagnosisRoleMapping;