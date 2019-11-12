'use strict';
module.exports = (sequelize, DataTypes) => {
  const PatientSymptomsRoleMapping = sequelize.define('patient_symptoms_role_mapping', {
    patient_symptom_role_mapping_id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncreament: true,
      allowNull: false
    },
    patient_id: {
      type: DataTypes.BIGINT(11),
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: 'Patients',
        key: 'patient_id'
      }
    },
    symptom_role_mapping_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      onDelete: "CASCADE",
      references: {
        model: 'SymptomsRoleMapping',
        key: 'symptom_role_mapping_id'
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
    underscored: true,
    sequelize,
    modelName: 'patient_symptoms_role_mapping',
    freezeTableName: true,
    timestamps: false
  });
  PatientSymptomsRoleMapping.associate = models => {
    // associations can be defined here
    PatientSymptomsRoleMapping.belongsTo(models.Patients, {
      as: 'patient',
      foreignKey: 'patient_id'
    });
    PatientSymptomsRoleMapping.belongsTo(models.SymptomsRoleMapping, {
      as: 'symptoms_role_mapping',
      foreignKey: 'symptom_role_mapping_id'
    });
  };

  return PatientSymptomsRoleMapping;
};