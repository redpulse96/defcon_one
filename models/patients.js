class Patients extends sequelize.Model {}

Patients.init({
  patient_id: {
    type: sequelize.BIGINT(11),
    primaryKey: true,
    allowNull: false
  },
  patient_name: {
    type: sequelize.STRING(50),
    allowNull: true
  },
  mobile_no: {
    type: sequelize.INT(10),
    allowNull: true
  },
  phone_code: {
    type: sequelize.INT(5),
    allowNull: true
  },
  age: {
    type: sequelize.INT(10),
    allowNull: true
  },
  gender: {
    type: sequelize.ENUM,
    values: ['Male','Female', 'Others'],
    allowNull: true
  },
  height: {
    type: sequelize.INT(100),
    allowNull: true
  },
  weight: {
    type: sequelize.INT(100),
    allowNull: true
  },
  blood_type: {
    type: sequelize.STRING(5),
    allowNull: true
  },
  date_of_birth: {
    type: 'TIMESTAMP',
    defaultValue: null,
    allowNull: true
  },
  email: {
    type: sequelize.STRING(50),
    allowNull: true
  },
  is_active: {
    type: sequelize.BOOLEAN,

    defaultValue: true,
    allowNull: false
  },
  is_archived: {
    type: sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  created_date: {
    type: 'TIMESTAMP',
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: true
  },
  updated_date: {
    type: 'TIMESTAMP',
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'patients',
  freezeTableName: true
});

module.exports = Patients;