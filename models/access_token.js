'use strict';

module.exports = (sequelize, DataTypes) => {
  const AccessToken = sequelize.define('access_token', {
    id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncrement: true,
      defaultValue: null
    },
    access_token: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ttl: {
      type: DataTypes.INTEGER(10),
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
      attributes: ['access_token', 'username', 'ttl'],
      order: [
        ['created_date', 'DESC'],
        ['updated_date', 'DESC']
      ]
    },
    scopes: {
      activeScope: {
        attributes: ['access_token', 'username', 'ttl'],
        where: {
          is_active: true,
          is_archived: false
        }
      },
      inActiveScope: {
        where: {
          is_active: false,
          is_archived: true
        }
      }
    },
    underscored: true,
    sequelize,
    modelName: 'access_token',
    freezeTableName: true,
    timestamps: false
  });

  return AccessToken;
};