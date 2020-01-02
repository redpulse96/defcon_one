const mongoose = packageHelper.mongoose;

const apiLogsSchema = new mongoose.Schema({
  api_path: {
    type: String,
    required: true
  },
  api_origin: {
    type: String,
  },
  api_hash: {
    type: String
  },
  api_method: {
    type: String,
    required: true
  },
  api_header: {
    type: Object,
    required: true
  },
  api_payload: {
    type: Object,
    required: true
  }
}, {
  timestamps: true
});

const Users = mongoose.model('api_logs', apiLogsSchema);
module.exports = Users;