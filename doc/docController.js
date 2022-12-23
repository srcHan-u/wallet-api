"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _crud = require("../database/crud");
var _docModel = require("./docModel");
// receives object of methods from crud.js
var _default = (0, _crud.crud)(_docModel.User);
exports.default = _default;