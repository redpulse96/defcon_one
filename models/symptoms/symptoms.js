'use strict';

module.exports = (sequelize, DataTypes) => {
  const Symptoms = sequelize.define('symptoms', {
    symptom_id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncrement: true,
      defaultValue: null
    },
    symptom_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    symptom_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    symptom_description: {
      type: DataTypes.STRING(100),
      allowNull: true
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
        attributes: { exclude: ['is_active', 'is_archived', 'created_date', 'updated_date'] }
      },
      inActiveScope: {
        where: {
          is_active: false,
          is_archived: true
        }
      }
    },
    sequelize,
    modelName: 'symptoms',
    freezeTableName: true,
    timestamps: false
  });
  Symptoms.associate = models => {
    // associations can be defined here
    Symptoms.hasMany(models['SymptomsRoleMapping'], {
      as: 'symptom_role_mappings',
      onDelete: "CASCADE",
      foreignKey: 'symptom_role_mapping_id'
    });
  };

  return Symptoms;
};