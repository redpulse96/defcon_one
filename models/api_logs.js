const mongoose = packageHelper.mongoose;

const apiLogs = new mongoose.Schema({
  apiName: {
    type: String,
    required: true
  },
  apiHash: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role_type: {
    type: String,
    required: true
  },
  feature_rights: {
    type: Array,
    required: false
  },
  is_active: {
    type: Boolean,
    default: true
  },
  is_archived: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Users = mongoose.model('users', apiLogs);
module.exports = Users;