'use strict';
module.exports = (sequelize, DataTypes) => {
  const Patients = sequelize.define('patients', {
    patient_id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncreament: true,
      allowNull: false
    },
    patient_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    mobile_no: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    phone_code: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    age: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    gender: {
      type: DataTypes.ENUM,
      values: ['Male', 'Female', 'Others'],
      allowNull: true
    },
    height: {
      type: DataTypes.INTEGER(100),
      allowNull: true
    },
    weight: {
      type: DataTypes.INTEGER(100),
      allowNull: true
    },
    blood_type: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    date_of_birth: {
      type: DataTypes.DATE,
      defaultValue: null,
      allowNull: true
    },
    email: {
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
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: true
    },
    updated_date: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: true
    }
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
    },
    underscored: true,
    sequelize,
    modelName: 'patients',
    freezeTableName: true,
    timestamps: false
  });
  Patients.associate = models => {
    // associations can be defined here
  };

  return Patients;
};