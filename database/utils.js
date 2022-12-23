"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utils = void 0;
var _expressValidator = require("express-validator");
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  if (token) {
    try {
      const decoded = _jsonwebtoken.default.verify(token, "121314");
      req.userId = decoded._id;
      next();
    } catch (error) {
      return res.status(403).json({
        message: "Нет допступа!"
      });
    }
  } else {
    return res.status(403).json({
      message: "Нет допступа!"
    });
  }
};
const registerValidation = [(0, _expressValidator.body)("email", "Неверный формат почты").isEmail(), (0, _expressValidator.body)("password", "Пароль должен быть минимум 5 символов").isLength({
  min: 5
}), (0, _expressValidator.body)("repeatPassword", "Пароль не совпадает!").isLength({
  min: 5
}), (0, _expressValidator.body)("promocode", "Не указан промокод!").isString(), (0, _expressValidator.body)("firstName", "Не указано имя!").isString(), (0, _expressValidator.body)("lastName", "Не указана фамилия!").isString(), (0, _expressValidator.body)("phomeNumber", "Не указан номер телефона!").isString(), (0, _expressValidator.body)("username", "Укажите логин, оно должно быть минимум 5 символа").isLength({
  min: 5
})];
const utils = {
  registerValidation,
  checkAuth
};
exports.utils = utils;