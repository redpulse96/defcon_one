'use strict';
module.exports = (sequelize, DataTypes) => {
  const InvestigationsRoleMapping = sequelize.define('investigations_role_mapping', {
    investigation_role_mapping_id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncrement: true,
      defaultValue: null
    },
    investigation_id: {
      type: DataTypes.BIGINT(1),
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: 'Investigations',
        key: 'investigation_id'
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
    modelName: 'investigations_role_mapping',
    freezeTableName: true,
    timestamps: false
  });
  InvestigationsRoleMapping.associate = models => {
    // associations can be defined here
    InvestigationsRoleMapping.belongsTo(models['Investigations'], {
      as: 'investigation',
      foreignKey: 'investigation_id'
    });
    InvestigationsRoleMapping.belongsTo(models['Roles'], {
      as: 'role',
      foreignKey: 'role_id'
    });
  };

  return InvestigationsRoleMapping;
};