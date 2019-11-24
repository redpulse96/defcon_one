'use strict';

module.exports = (sequelize, DataTypes) => {
  const Investigations = sequelize.define('investigations', {
    investigation_id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncrement: true,
      defaultValue: null
    },
    investigation_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    investigation_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    investigation_description: {
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
      }
    },
    sequelize,
    modelName: 'investigations',
    freezeTableName: true,
    timestamps: false
  });
  Investigations.associate = models => {
    // associations can be defined here
    Investigations.hasMany(models['InvestigationsRoleMapping'], {
      onDelete: "CASCADE",
      foreignKey: 'investigations_role_mapping_id'
    });
  };

  return Investigations;
};