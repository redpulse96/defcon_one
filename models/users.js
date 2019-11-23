const mongoose = packageHelper.mongoose;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  mobile_no: {
    type: Number,
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

const Users = mongoose. model('users', UserSchema);
module.exports = Users;