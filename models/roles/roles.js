'use strict';

module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define('roles', {
    role_id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncreament: true,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM,
      values: ['r_dentist', 'r_ortho'],
      allowNull: true
    },
    role_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    role_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    role_description: {
      type: DataTypes.STRING(100),
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
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: true
    },
    updated_date: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      allowNull: true
    }
  }, {
    underscored: true,
    sequelize,
    modelName: 'roles',
    freezeTableName: true,
    timestamps: false
  }, {
    defaultScope: {
      where: {
        is_active: 1,
        is_archived: 0
      },
      order: [
        ['created_date', 'DESC'],
        ['updated_date', 'DESC']
      ]
    }
  });
  Roles.associate = models => {
    // associations can be defined here
    Roles.hasMany(models.SymptomsRoleMapping, {
      as: 'symptoms_role_mapping',
      onDelete: "CASCADE",
      foreignKey: 'role_id'
    });
    Roles.hasMany(models.ExaminationsRoleMapping, {
      as: 'examinations_role_mapping',
      onDelete: "CASCADE",
      foreignKey: 'role_id'
    });
    Roles.hasMany(models.DiagnosisRoleMapping, {
      as: 'diagnosis_role_mapping',
      onDelete: "CASCADE",
      foreignKey: 'role_id'
    });
  };

  return Roles;
};