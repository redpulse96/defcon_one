'use strict';

module.exports = (sequelize, DataTypes) => {
  const Symptoms = sequelize.define('symptoms', {
    symptom_id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncreament: true,
      allowNull: false
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
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: true
    },
    updated_date: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'symptoms',
    freezeTableName: true,
    timestamps: false
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
    }
  });
  Symptoms.associate = models => {
    // associations can be defined here
    Symptoms.hasMany(models.SymptomsRoleMapping, {
      as: 'symptom_role_mappings',
      onDelete: "CASCADE",
      foreignKey: 'symptom_role_mapping_id'
    });
  };

  return Symptoms;
};