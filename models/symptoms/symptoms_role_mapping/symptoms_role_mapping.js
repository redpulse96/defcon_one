'use strict';

module.exports = (sequelize, DataTypes) => {
  const SymptomsRoleMapping = sequelize.define('symptoms_role_mapping', {
    symptom_role_mapping_id: {
      type: DataTypes.BIGINT(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    symptom_id: {
      type: DataTypes.BIGINT(1),
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: 'Symptoms',
        key: 'symptom_id'
      }
    },
    role_id: {
      type: DataTypes.BIGINT(1),
      allowNull: true,
      references: {
        model: 'Roles',
        key: 'role_id'
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    is_archived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: true
    },
    updated_date: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: true
    }
  }, {
    defaultScope: {
      where: {
        is_active: 1,
        is_archived: 0
      },
      order: [
        ['created_date', 'DESC'],
        ['updated_date', 'DESC']
      ]
    },
    sequelize,
    modelName: 'symptoms_role_mapping',
    freezeTableName: true,
    timestamps: false
  });
  SymptomsRoleMapping.associate = models => {
    // associations can be defined here
    SymptomsRoleMapping.belongsTo(models.Symptoms, {
      as: 'symptom',
      foreignKey: 'symptom_id'
    });
    SymptomsRoleMapping.belongsTo(models.Roles, {
      as: 'role',
      foreignKey: 'role_id'
    });
  };

  return SymptomsRoleMapping;
};
