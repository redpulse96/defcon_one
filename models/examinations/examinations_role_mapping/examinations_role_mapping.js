'use strict';
module.exports = (sequelize, DataTypes) => {
  const ExaminationsRoleMapping = sequelize.define('examinations_role_mapping', {
    examination_role_mapping_id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncrement: true,
      defaultValue: null
    },
    examination_id: {
      type: DataTypes.BIGINT(1),
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: 'Examinations',
        key: 'examination_id'
      }
    },
    role_id: {
      type: DataTypes.BIGINT(1),
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: 'Roles',
        key: 'role_id'
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
    sequelize,
    modelName: 'examinations_role_mapping',
    freezeTableName: true,
    timestamps: false
  });
  ExaminationsRoleMapping.associate = models => {
    // associations can be defined here
    ExaminationsRoleMapping.belongsTo(models['Examinations'], {
      as: 'examination',
      foreignKey: 'examination_id'
    });
    ExaminationsRoleMapping.belongsTo(models['Roles'], {
      as: 'role',
      foreignKey: 'role_id'
    });
  };

  return ExaminationsRoleMapping;
};