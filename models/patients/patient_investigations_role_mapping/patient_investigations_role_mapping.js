'use strict';
module.exports = (sequelize, DataTypes) => {
  const PatientInvestigationsRoleMapping = sequelize.define('patient_investigations_role_mapping', {
    patient_investigation_role_mapping_id: {
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
    investigation_role_mapping_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      onDelete: "CASCADE",
      references: {
        model: 'InvestigationsRoleMapping',
        key: 'investigation_role_mapping_id'
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
    modelName: 'patient_investigations_role_mapping',
    freezeTableName: true,
    timestamps: false
  });
  PatientInvestigationsRoleMapping.associate = models => {
    // associations can be defined here
    PatientInvestigationsRoleMapping.belongsTo(models['Patients'], {
      as: 'patient',
      foreignKey: 'patient_id'
    });
    PatientInvestigationsRoleMapping.belongsTo(models['InvestigationsRoleMapping'], {
      as: 'investigations_role_mapping',
      foreignKey: 'investigation_role_mapping_id'
    });
    PatientInvestigationsRoleMapping.belongsTo(models['Appointments'], {
      as: 'appointment',
      foreignKey: 'appointment_id'
    });
  };

  return PatientInvestigationsRoleMapping;
};