'use strict';
module.exports = (sequelize, DataTypes) => {
  const PatientExaminationsRoleMapping = sequelize.define('patient_examinations_role_mapping', {
    patient_examination_role_mapping_id: {
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
    examination_role_mapping_id: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      onDelete: "CASCADE",
      references: {
        model: 'ExaminationsRoleMapping',
        key: 'examination_role_mapping_id'
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
    activeScope: {
      where: {
        is_active: true,
        is_archived: false
      }
    },
    underscored: true,
    sequelize,
    modelName: 'patient_examinations_role_mapping',
    freezeTableName: true,
    timestamps: false
  });
  PatientExaminationsRoleMapping.associate = models => {
    // associations can be defined here
    PatientExaminationsRoleMapping.belongsTo(models['Patients'], {
      as: 'patient',
      foreignKey: 'patient_id'
    });
    PatientExaminationsRoleMapping.belongsTo(models['ExaminationsRoleMapping'], {
      as: 'examinations_role_mapping',
      foreignKey: 'examination_role_mapping_id'
    });
  };

  return PatientExaminationsRoleMapping;
};