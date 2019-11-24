'use strict';

module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define('roles', {
    role_id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncrement: true,
      defaultValue: null
    },
    role_type: {
      type: DataTypes.ENUM,
      values: ['r_dentist', 'r_ortho'], //more will be added based on the new roles
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
    modelName: 'roles',
    freezeTableName: true,
    timestamps: false
  });
  Roles.associate = models => {
    // associations can be defined here
    Roles.hasMany(models['SymptomsRoleMapping'], {
      as: 'symptoms_role_mapping',
      onDelete: "CASCADE",
      foreignKey: 'role_id'
    });
    Roles.hasMany(models['ExaminationsRoleMapping'], {
      as: 'examinations_role_mapping',
      onDelete: "CASCADE",
      foreignKey: 'role_id'
    });
    Roles.hasMany(models['DiagnosisRoleMapping'], {
      as: 'diagnosis_role_mapping',
      onDelete: "CASCADE",
      foreignKey: 'role_id'
    });
  };

  return Roles;
};