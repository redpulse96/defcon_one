const SECRET_KEY = 's%3Af-LcbnMAtrDwm87ExePnNxrakQBApz2F.fkY%2FiA4%2FekLHtzJ3bLswxLKeHz2iE7gYHcR6s8idtH4';
const TWILIO = {
  ACCOUNTSID: 'ACc0d5718cc37715a8cb99f8b7d2243309',
  AUTHTOKEN: 'fef1ff2a975cea7c695663b0f85fc445'
}
const DEFAULT_USERNAME = '@emr.in';
const DEFAULT_SALT = 10;

const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  OPERATING: 'operating',
  RESCHEDULED: 'rescheduled',
  CLOSED: 'closed'
};

const APPOINTMENT_STATUS_MATRIX = {
  'pending': [APPOINTMENT_STATUS.OPERATING, APPOINTMENT_STATUS.RESCHEDULED, APPOINTMENT_STATUS.CLOSED],
  'operating': [APPOINTMENT_STATUS.CLOSED, APPOINTMENT_STATUS.RESCHEDULED],
  'rescheduled': [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.CLOSED],
  'closed': []
};

const MANDATORY_PARAMS = {
  REGISTER_USER: ['name', 'mobile_no', 'role_type', 'password'],
  CREATE_PATIENT: ['patient_name', 'mobile_no', 'date_of_birth'],
  UPDATE_PATIENT: ['mobile_no', 'update_obj'],
  CREATE_APPOINTMENT: ['appointment_name', 'appointment_date', 'patient_id', 'appointment_status', 'from_time', 'to_time'],
  APPOINTMENT_DETAIL: ['appointment_id'],
  APPOINTMENT_FULFILMENT: ['appointment_id', 'appointment_status']
}

/**
 * Exports are written below
 */

exports.SECRET_KEY = SECRET_KEY;
exports.TWILIO = TWILIO;
exports.DEFAULT_USERNAME = DEFAULT_USERNAME;
exports.DEFAULT_SALT = DEFAULT_SALT;
exports.APPOINTMENT_STATUS = APPOINTMENT_STATUS;
exports.APPOINTMENT_STATUS_MATRIX = APPOINTMENT_STATUS_MATRIX;
exports.MANDATORY_PARAMS = MANDATORY_PARAMS;
