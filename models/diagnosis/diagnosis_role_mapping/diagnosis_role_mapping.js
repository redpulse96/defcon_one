'use strict';

module.exports = (sequelize, DataTypes) => {
  const DiagnosisRoleMapping = sequelize.define('diagnosis_role_mapping', {
    diagnosis_role_mapping_id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncrement: true,
      defaultValue: null
    },
    diagnosis_id: {
      type: DataTypes.BIGINT(1),
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: 'Diagnosis',
        key: 'diagnosis_id'
      }
    },
    role_id: {
      type: DataTypes.BIGINT(1),
      allowNull: true,
      onDelete: "CASCADE",
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
      type: DataTypes.NOW,
      defaultValue: DataTypes.NOW,
      allowNull: true
    },
    updated_date: {
      type: DataTypes.TIME,
      defaultValue: DataTypes.NOW,
      allowNull: true
    }
  }, {
    hooks: {
      afterUpdate: () => {
      }
    },
    defaultScope: {
      order: [
        ['created_date', 'DESC'],
        ['updated_date', 'DESC']
      ]
    },
    scopes: {
      activeScope: {
        where: {
          is_active: true,
          is_archived: false
        },
        attributes: {
          exclude: ['is_active', 'is_archived', 'created_date', 'updated_date']
        }
      },
      inActiveScope: {
        where: {
          is_active: false,
          is_archived: true
        }
      }
    },
    sequelize,
    modelName: 'diagnosis_role_mapping',
    freezeTableName: true,
    timestamps: false
  });
  DiagnosisRoleMapping.associate = models => {
    // associations can be defined here
    DiagnosisRoleMapping.belongsTo(models['Diagnosis'], {
      as: 'diagnosis',
      foreignKey: 'diagnosis_id'
    });
    DiagnosisRoleMapping.belongsTo(models['Roles'], {
      as: 'role',
      foreignKey: 'role_id'
    });
  };

  return DiagnosisRoleMapping;
};