'use strict';
module.exports = (sequelize, DataTypes) => {
  const PatientDiagnosisRoleMapping = sequelize.define('patient_diagnosis_role_mapping', {
    patient_diagnosis_role_mapping_id: {
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
    diagnosis_role_mapping_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      onDelete: "CASCADE",
      references: {
        model: 'DiagnosisRoleMapping',
        key: 'diagnosis_role_mapping_id'
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
    modelName: 'patient_diagnosis_role_mapping',
    freezeTableName: true,
    timestamps: false
  });
  PatientDiagnosisRoleMapping.associate = models => {
    // associations can be defined here
    PatientDiagnosisRoleMapping.belongsTo(models.Patients, {
      as: 'patient',
      foreignKey: 'patient_id'
    });
    PatientDiagnosisRoleMapping.belongsTo(models.DiagnosisRoleMapping, {
      as: 'diagnosis_role_mapping',
      foreignKey: 'diagnosis_role_mapping_id'
    });
  };

  return PatientDiagnosisRoleMapping;
};