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
    appointment_id: {
      type: DataTypes.BIGINT(11),
      allowNull: true,
      references: {
        model: 'Appointments',
        key: 'appointment_id'
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
    created_by: {
      type: DataTypes.STRING(50),
      defaultValue: null
    },
    doctor_remarks: {
      type: DataTypes.STRING(100),
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
        }
      },
      inActiveScope: {
        where: {
          is_active: false,
          is_archived: true
        }
      }
    },
    underscored: true,
    sequelize,
    modelName: 'patient_prescription',
    freezeTableName: true,
    timestamps: false
  });
  PatientPrescription.associate = models => {
    // associations can be defined here
    PatientPrescription.belongsTo(models['Appointments'], {
      as: 'appointment',
      foreignKey: 'appointment_id'
    });
    PatientPrescription.belongsTo(models['Patients'], {
      as: 'patients',
      foreignKey: 'patient_id'
    });
  };

  return PatientPrescription;
};