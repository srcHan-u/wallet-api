import { body } from "express-validator";
import jwt from "jsonwebtoken";

const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (token) {
    try {
        const decoded = jwt.verify(token, "121314");
        req.userId = decoded._id
        next();
    } catch (error) {
        return res.status(403).json({
            message: "Нет допступа!"
        })
    }
  }else{
    return res.status(403).json({
        message: "Нет допступа!"
    })
  }
};

const registerValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
  body("repeatPassword", "Пароль не совпадает!").isLength({
    min: 5,
  }),
  body("promocode", "Не указан промокод!").isString(),
  body("firstName", "Не указано имя!").isString(),
  body("lastName", "Не указана фамилия!").isString(),
  body("phomeNumber", "Не указан номер телефона!").isString(),
  body("username", "Укажите логин, оно должно быть минимум 5 символа").isLength({
    min: 5,
  }),
];



export const utils = {
  registerValidation,
  checkAuth,
};
