"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _URI = require("./URI");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const connect = (location = _URI.URI) => {
  _mongoose.default.connect(location);
  const db = _mongoose.default.connection;
  db.on('error', err => console.log('connection error:', err));
  db.once('open', () => console.log('Connected to cwdb!'));
};
exports.connect = connect;