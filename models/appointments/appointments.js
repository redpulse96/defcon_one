'use strict';

module.exports = (sequelize, DataTypes) => {
  const Appointments = sequelize.define('appointments', {
    appointment_id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncreament: true,
      allowNull: false
    },
    appointment_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    appointment_date: {
      type: DataTypes.DATE,
      defaultValue: 'CURRENT_TIMESTAMP',
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM,
      values: ['closed', 'pending', 'rescheduled', 'operating'],
      allowNull: false
    },
    appointment_date: {
      type: DataTypes.DATE,
      defaultValue: 'CURRENT_TIMESTAMP',
      allowNull: true
    },
    from_time: {
      type: DataTypes.DATE,
      defaultValue: null,
      allowNull: false
    },
    to_time: {
      type: DataTypes.DATE,
      defaultValue: null,
      allowNull: false
    },
    doctor_remarks: {
      type: DataTypes.STRING(100),
      defaultValue: null,
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
    modelName: 'appointments',
    freezeTableName: true,
    timestamps: false
  });
  Appointments.associate = models => {
    // associations can be defined here
    Appointments.hasMany(models.AppointmentsLog, {
      as: 'appointments_log',
      onDelete: "CASCADE",
      foreignKey: 'appointment_id'
    });
  };

  return Appointments;
};