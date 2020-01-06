'use strict';
module.exports = (sequelize, DataTypes) => {
  const AppointmentDiagnosisRoleMapping = sequelize.define('appointment_diagnosis_role_mapping', {
    appointment_diagnosis_role_mapping_id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncrement: true,
      defaultValue: null
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
    appointment_id: {
      type: DataTypes.BIGINT(11),
      allowNull: true,
      references: {
        model: 'Appointments',
        key: 'appointment_id'
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
    modelName: 'appointment_diagnosis_role_mapping',
    freezeTableName: true,
    timestamps: false
  });
  AppointmentDiagnosisRoleMapping.associate = models => {
    // associations can be defined here
    AppointmentDiagnosisRoleMapping.belongsTo(models['DiagnosisRoleMapping'], {
      as: 'diagnosis_role_mapping',
      foreignKey: 'diagnosis_role_mapping_id'
    });
    AppointmentDiagnosisRoleMapping.belongsTo(models['Appointments'], {
      as: 'appointment',
      foreignKey: 'appointment_id'
    });
  };

  return AppointmentDiagnosisRoleMapping;
};