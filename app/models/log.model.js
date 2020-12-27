const mongoose = require( 'mongoose' );

const logSchema = new mongoose.Schema({
  severity: String,
  username: String,
  page: String,
  text: String,
  timestamp: {type: Date, index: true, default: Date.now, expires: '30d'}
});

module.exports = mongoose.model("Logs", logSchema);