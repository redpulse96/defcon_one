'use strict';

module.exports = (sequelize, DataTypes) => {
  const AppointmentLogs = sequelize.define('appointment_logs', {
    appointment_log_id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncrement: true,
      defaultValue: null
    },
    appointment_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false
    },
    appointment_status: {
      type: DataTypes.STRING(50),
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
    modelName: 'appointment_logs',
    freezeTableName: true,
    timestamps: false
  });
  AppointmentLogs.associate = models => {
    // associations can be defined here
    AppointmentLogs.belongsTo(models['Appointments'], {
      as: 'appointment',
      foreignKey: 'appointment_id'
    });
  };

  return AppointmentLogs;
};