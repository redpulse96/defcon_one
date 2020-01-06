'use strict';

module.exports = (sequelize, DataTypes) => {
  const Examinations = sequelize.define('examinations', {
    examination_id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncrement: true,
      defaultValue: null
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
    hooks: {
      afterUpdate: () => {
      }
    },
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
        },
        attributes: {
          exclude: ['is_active', 'is_archived', 'created_date', 'updated_date']
        }
      },
      inActiveScope: {
        where: {
          is_active: false,
          is_archived: true
        }
      }
    },
    sequelize,
    modelName: 'examinations',
    freezeTableName: true,
    timestamps: false
  });
  Examinations.associate = models => {
    // associations can be defined here
    Examinations.hasMany(models['ExaminationsRoleMapping'], {
      onDelete: "CASCADE",
      foreignKey: 'examination_role_mapping_id'
    });
  };

  return Examinations;
};