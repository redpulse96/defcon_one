'use strict';
module.exports = (sequelize, DataTypes) => {
  const PatientPrescription = sequelize.define('patient_prescription', {
    patient_prescription_id: {
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
    patient_symptom_role_mapping_id: {
      type: DataTypes.BIGINT(11),
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: 'PatientSymptomsRoleMapping',
        key: 'patient_symptom_role_mapping_id'
      }
    },
    patient_examination_role_mapping_id: {
      type: DataTypes.BIGINT(11),
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: 'PatientExaminationssRoleMapping',
        key: 'patient_examination_role_mapping_id'
      }
    },
    patient_investigation_role_mapping_id: {
      type: DataTypes.BIGINT(11),
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: 'PatientInvestigationsRoleMapping',
        key: 'patient_investigation_role_mapping_id'
      }
    },
    patient_diagnosis_role_mapping_id: {
      type: DataTypes.BIGINT(11),
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: 'PatientDiagnosissRoleMapping',
        key: 'patient_diagnosis_role_mapping_id'
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
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
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
    modelName: 'patient_prescription',
    freezeTableName: true,
    timestamps: false
  });
  PatientPrescription.associate = models => {
    // associations can be defined here
  };

  return PatientPrescription;
};