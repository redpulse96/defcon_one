'use strict';
module.exports = (sequelize, DataTypes) => {
  const Medicines = sequelize.define('medicines', {
    medicine_id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncrement: true,
      defaultValue: null
    },
    medicine_name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    medicine_description: {
      type: DataTypes.STRING(50),
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
      afterUpdate: () => {}
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
    modelName: 'medicines',
    freezeTableName: true,
    timestamps: false
  });
  Medicines.associate = models => {
    // associations can be defined here
    Medicines.belongsTo(models['PatientPrescription'], {
      as: 'patient_prescription',
      onDelete: "CASCADE",
      foreignKey: 'medicine_id'
    });
  };
  return Medicines;
};