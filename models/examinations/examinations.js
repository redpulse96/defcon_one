'use strict';

module.exports = (sequelize, DataTypes) => {
  const Examinations = sequelize.define('examinations', {
    examination_id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncreament: true,
      allowNull: false
    },
    examination_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    examination_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    examination_description: {
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
    sequelize,
    modelName: 'examinations',
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
  Examinations.associate = models => {
    // associations can be defined here
    Examinations.hasMany(models.ExaminationsRoleMapping, {
      onDelete: "CASCADE",
      foreignKey: 'examination_role_mapping_id'
    });
  };

  return Examinations;
};