'use strict';

module.exports = (sequelize, DataTypes) => {
  const Appointments = sequelize.define('appointments', {
    appointment_id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncrement: true,
      defaultValue: null
    },
    appointment_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    appointment_date: {
      type: DataTypes.DATEONLY,
      defaultValue: 'CURRENT_TIMESTAMP',
      allowNull: true
    },
    patient_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false
    },
    appointment_status: {
      type: DataTypes.ENUM,
      values: ['closed', 'pending', 'rescheduled', 'operating'],
      allowNull: false
    },
    rescheduled_date: {
      type: DataTypes.DATEONLY,
      defaultValue: 'CURRENT_TIMESTAMP',
      allowNull: true
    },
    from_time: {
      type: DataTypes.TIME,
      defaultValue: null,
      allowNull: true
    },
    to_time: {
      type: DataTypes.TIME,
      defaultValue: null,
      allowNull: true
    },
    created_by: {
      type: DataTypes.BIGINT(11),
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
    modelName: 'appointments',
    freezeTableName: true,
    timestamps: false
  });
  Appointments.associate = models => {
    // associations can be defined here
    Appointments.hasMany(models['AppointmentLogs'], {
      as: 'appointment_logs',
      onDelete: "CASCADE",
      foreignKey: 'appointment_id'
    });
  };

  return Appointments;
};