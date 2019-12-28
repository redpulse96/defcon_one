'use strict';

module.exports = (sequelize, DataTypes) => {
  const Diagnosis = sequelize.define('diagnosis', {
    diagnosis_id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncrement: true,
      defaultValue: null
    },
    diagnosis_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    diagnosis_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    diagnosis_description: {
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
      }
    },
    sequelize,
    modelName: 'diagnosis',
    freezeTableName: true,
    timestamps: false
  });
  Diagnosis.associate = models => {
    // associations can be defined here
    Diagnosis.hasMany(models['DiagnosisRoleMapping'], {
      onDelete: "CASCADE",
      foreignKey: 'diagnosis_role_mapping_id'
    });
  };

  return Diagnosis;
};