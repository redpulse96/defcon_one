'use strict';
module.exports = (sequelize, DataTypes) => {
  const PatientPrescription = sequelize.define('patient_prescription', {
    patient_prescription_id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncrement: true,
      defaultValue: null
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
        model: 'PatientExaminationsRoleMapping',
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
        model: 'PatientDiagnosisRoleMapping',
        key: 'patient_diagnosis_role_mapping_id'
      }
    },
    reference_id: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    medicine_id: {
      type: DataTypes.BIGINT(11),
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
      }
    }},
    underscored: true,
    sequelize,
    modelName: 'patient_prescription',
    freezeTableName: true,
    timestamps: false
  });
  PatientPrescription.associate = models => {
    // associations can be defined here
    PatientPrescription.belongsTo(models['PatientSymptomsRoleMapping'], {
      as: 'patient_symptoms_role_mapping',
      foreignKey: 'patient_symptom_role_mapping_id'
    });
    PatientPrescription.belongsTo(models['PatientInvestigationsRoleMapping'], {
      as: 'patient_investigations_role_mapping',
      foreignKey: 'patient_investigation_role_mapping_id'
    });
    PatientPrescription.belongsTo(models['PatientExaminationsRoleMapping'], {
      as: 'patient_examinations_role_mapping',
      foreignKey: 'patient_examination_role_mapping_id'
    });
    PatientPrescription.belongsTo(models['PatientDiagnosisRoleMapping'], {
      as: 'patient_diagnosis_role_mapping',
      foreignKey: 'patient_diagnosis_role_mapping_id'
    });
  };

  return PatientPrescription;
};