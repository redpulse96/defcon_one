'use strict';
module.exports = (sequelize, DataTypes) => {
  const Patients = sequelize.define('patients', {
    patient_id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncrement: true,
      defaultValue: null
    },
    patient_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    mobile_no: {
      type: DataTypes.BIGINT(10),
      allowNull: true
    },
    phone_code: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    age: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    gender: {
      type: DataTypes.ENUM,
      values: ['Male', 'Female', 'Others'],
      allowNull: true
    },
    height: {
      type: DataTypes.INTEGER(100),
      allowNull: true
    },
    weight: {
      type: DataTypes.INTEGER(100),
      allowNull: true
    },
    blood_type: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      defaultValue: null,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    created_by: {
      type: DataTypes.STRING(50),
      defaultValue: null
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
      }
    },
    underscored: true,
    sequelize,
    modelName: 'patients',
    freezeTableName: true,
    timestamps: false
  });
  Patients.associate = models => {
    // associations can be defined here
    Patients.hasMany(models['Appointments'], {
      as: 'appointments',
      foreignKey: 'patient_id'
    });
    Patients.hasMany(models['PatientPrescription'], {
      as: 'patient_prescription',
      onDelete: "CASCADE",
      foreignKey: 'patient_id'
    });
    Patients.hasMany(models['PatientSymptomsRoleMapping'], {
      as: 'patient_symptoms_role_mapping',
      onUpdate: "CASCADE",
      foreignKey: 'patient_id'
    });
    Patients.hasMany(models['PatientInvestigationsRoleMapping'], {
      as: 'patient_investigations_role_mapping',
      onUpdate: "CASCADE",
      foreignKey: 'patient_id'
    });
    Patients.hasMany(models['PatientExaminationsRoleMapping'], {
      as: 'patient_examinations_role_mapping',
      onUpdate: "CASCADE",
      foreignKey: 'patient_id'
    });
    Patients.hasMany(models['PatientDiagnosisRoleMapping'], {
      as: 'patient_diagnosis_role_mapping',
      onUpdate: "CASCADE",
      foreignKey: 'patient_id'
    });
  };

  return Patients;
};