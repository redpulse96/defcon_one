'use strict';

module.exports = (sequelize, DataTypes) => {
  const AppointmentsLog = sequelize.define('appointments_log', {
    appointment_log_id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncreament: true,
      allowNull: false
    },
    appointment_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false
    },
    status: {
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
      type: DataTypes.DATE,
      defaultValue: 'CURRENT_TIMESTAMP',
      allowNull: true
    },
    updated_date: {
      type: DataTypes.DATE,
      defaultValue: 'CURRENT_TIMESTAMP',
      allowNull: true
    }
  }, {
    defaultScope: {
      where: {
        is_active: true,
        is_archived: false
      },
      order: [
        ['created_date', 'DESC'],
        ['updated_date', 'DESC']
      ]
    },
    underscored: true,
    sequelize,
    modelName: 'appointments_log',
    freezeTableName: true,
    timestamps: false
  });
  AppointmentsLog.associate = models => {
    // associations can be defined here
    AppointmentsLog.belongsTo(models.Appointments, {
      as: 'appointment',
      foreignKey: 'appointment_id'
    });
  };

  return AppointmentsLog;
};