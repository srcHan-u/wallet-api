"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _docController = _interopRequireDefault(require("./docController"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = (0, _express.Router)();

// one
router.route('/doc/:id').get(_docController.default.getOne).put(_docController.default.updateOne).delete(_docController.default.deleteOne);
router.route('/doc').post(_docController.default.createOne);

// many
router.route('/docs').get(_docController.default.getMany);
var _default = router;
exports.default = _default;