const dbConfig = require("../config/db.config.js");
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.url = dbConfig.url;
db.user = require("./user.model");
db.prodotti = require("./prodotti.model")
db.role = require("./role.model");
db.ordini = require("./ordini.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;