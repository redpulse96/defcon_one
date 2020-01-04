'use strict';
module.exports = (sequelize, DataTypes) => {
  const AppointmentExaminationsRoleMapping = sequelize.define('appointment_examinations_role_mapping', {
    appointment_examination_role_mapping_id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncrement: true,
      defaultValue: null
    },
    examination_role_mapping_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      onDelete: "CASCADE",
      references: {
        model: 'ExaminationsRoleMapping',
        key: 'examination_role_mapping_id'
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
    modelName: 'appointment_examinations_role_mapping',
    freezeTableName: true,
    timestamps: false
  });
  AppointmentExaminationsRoleMapping.associate = models => {
    // associations can be defined here
    AppointmentExaminationsRoleMapping.belongsTo(models['ExaminationsRoleMapping'], {
      as: 'examinations_role_mapping',
      foreignKey: 'examination_role_mapping_id'
    });
    AppointmentExaminationsRoleMapping.belongsTo(models['Appointments'], {
      as: 'appointment',
      foreignKey: 'appointment_id'
    });
  };

  return AppointmentExaminationsRoleMapping;
};