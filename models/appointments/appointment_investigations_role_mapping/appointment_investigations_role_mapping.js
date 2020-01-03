'use strict';
module.exports = (sequelize, DataTypes) => {
  const AppointmentInvestigationsRoleMapping = sequelize.define('appointment_investigations_role_mapping', {
    appointment_investigation_role_mapping_id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncrement: true,
      defaultValue: null
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
    modelName: 'appointment_investigations_role_mapping',
    freezeTableName: true,
    timestamps: false
  });
  AppointmentInvestigationsRoleMapping.associate = models => {
    // associations can be defined here
    AppointmentInvestigationsRoleMapping.belongsTo(models['InvestigationsRoleMapping'], {
      as: 'investigations_role_mapping',
      foreignKey: 'investigation_role_mapping_id'
    });
    AppointmentInvestigationsRoleMapping.belongsTo(models['Appointments'], {
      as: 'appointment',
      foreignKey: 'appointment_id'
    });
  };

  return AppointmentInvestigationsRoleMapping;
};