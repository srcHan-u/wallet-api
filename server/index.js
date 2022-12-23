import express from "express";
import morgan from "morgan";
import { connect } from "../database/index";
import docRouter from "../doc/docRouter";
import { createGzip } from "zlib";
import { createReadStream } from "fs";
import { resolve } from "path";
import cors from "cors";
const config = require("../../config.json");
const path = require("path");
const crypto = require("crypto");
//
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { utils } from "../database/utils.js";
import { User, Сurrency } from "../doc/docModel.js";
import bcrypt from "bcrypt";
// import { verify } from "crypto";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/api", docRouter);

app.get("/doc/currency", async (req, res) => {
  try {
    const data = await Сurrency.find();

    if (!data) {
      return res.status(400).json({
        message: "We haven't items",
      });
    }

    return res.status(200).json({
      ...data,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      message: "Something wrong",
    });
  }
});

app.post("/doc/currency", async (req, res) => {
  try {
    const doc = new Сurrency({
      dollar: {
        ruble: 62.0,
        euro: 0.95,
        bitcoin: 0.00005943,
        litecoin: 0.01300974,
        ethereum: 0.00081129,
        tether: 0.99998655,
      },
      euro: {
        ruble: 65.17,
        dollar: 1.05,
        bitcoin: 0.00006246,
        litecoin: 0.01366865,
        ethereum: 0.00085259,
        tether: 1.05105857,
      },
      ruble: {
        dollar: 0.016,
        euro: 0.015,
        bitcoin: 0.0000009,
        litecoin: 0.00020675,
        ethereum: 0.00001289,
        tether: 0.01589143,
      },
      bitcoin: {
        ruble: 1058841,
        dollar: 16824.43,
        euro: 16008.82,
        litecoin: 219.00370472,
        ethereum: 13.65797176,
        tether: 16827,
      },
      litecoin: {
        ruble: 4836.01,
        dollar: 76.85,
        euro: 73.12,
        bitcoin: 0.00456589,
        ethereum: 0.06235722,
        tether: 76.85104097,
      },
      ethereum: {
        ruble: 77578.03,
        dollar: 1232.91,
        euro: 1172.89,
        bitcoin: 0.07325137,
        litecoin: 16.0366351,
        tether: 1232,
      },
      tether: {
        ruble: 62.93,
        dollar: 1.0,
        euro: 0.95147,
        bitcoin: 0.00005943,
        litecoin: 0.01301057,
        ethereum: 0.0008111,
      },
    });

    const currency = await doc.save();

    res.json({
      ...currency._doc,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      message: "Что-то пошло не так...",
    });
  }
});
app.put("/doc/currency", async (req, res) => {
   try {
     const { from, to, value } = req.body;
     if (from && to && value) {
        const field = `${from}.${to}`;
        console.log(field);
        const id = "6399c8a51cd6fde53fd7b736";
        await Сurrency.findByIdAndUpdate(
          { _id: id },
          { $set: { [field]: Number(value) } }
        );
        return res.status(200).json({
          message: "Данные обновлены",
          field
        });
       
     }else{
       return res.status(400).json({
          message: "Неверно указаны данные"
       });
     }
   } catch (e) {
     res.status(400).json({
       message: "Не удалось обновить данные!",
       err: e.message,
     });
   }
 });
// login

app.post("/auth/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(500).json({
        message: "Пользователь не найден!",
      });
    }
    /* 
        const isValidPass = await bcrypt.compare(
            req.body.password,
            user._doc.password
        );
    */
    const isValidPass = () => {
      return req.body.password === user._doc.password;
    };
    const pass = await isValidPass();

    if (!pass) {
      return res.status(500).json({
        message: "Неверный логин или пароль!",
      });
    }
    const token = jwt.sign(
      {
        _id: user.id,
      },
      "121314",
      {
        expiresIn: "30d",
      }
    );

    res.json({
      ...user._doc,
      token,
      message: "Авторизация прошла успешно!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось авторизоваться!",
    });
  }
});

// registration
app.post("/auth/register", utils.registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    if (req.body.promocode !== "751602" || req.body.promocode === "") {
      return res.status(400).json({
        message: "Невереный промокод",
      });
    }

    if (req.body.password !== req.body.repeatPassword) {
      return res.status(400).json({
        message: "Пароли не совпадают",
      });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new User({
      email: req.body.email,
      promocode: req.body.promocode,
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phomeNumber: req.body.phomeNumber,
      documents: {
        url: [],
      },
      balance: {
        total: 0,
        bitcoin: 0,
        litecoin: 0,
        tether: 0,
        ethereum: 0,
      },
      history: {
        bitcoin: [
          {
            data: null,
            status: null,
            type: null,
            method: null,
            hash: null,
            amount: null,
            receiving: 0,
            withdrawal: 0,
          },
        ],
        all: [
          {
            data: null,
            status: null,
            type: null,
            hash: null,
            method: null,
            amount: null,
            receiving: 0,
            withdrawal: 0,
          },
        ],
      },
      password,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user.id,
      },
      "121314",
      {
        expiresIn: "30d",
      }
    );
    res.json({
      ...user._doc,
      token,
      message: "Регистрация прошла успешно!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось зарегистрироваться!",
    });
  }
});

// auth me
app.get("/auth/me", utils.checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден!",
      });
    }
    const { ...userData } = user._doc;
    res.json({
      ...userData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Нет доступа!",
    });
  }
});

app.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) {
    return res.status(400).json({
      message: "Пользователь не найден!",
    });
  }

  return res.json({
    user,
  });
});
// update
// app.get("/user/:id", async (req, res) => {
//   const id = req.params.id;
//   const user = await User.findById(id);

//   if (!user) {
//     return res.status(400).json({
//       message: "Пользователь не найден!",
//     });
//   }

//   return res.json({
//     user,
//   });
// });
app.delete("/user/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) {
    return res.status(400).json({
      message: "Пользователь не найден!",
    });
  }
  await User.findByIdAndDelete(id);
  return res.json({
    message: "Пользователь удален!",
  });
});
app.put("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    const { key } = req.body;
    if (!user) {
      res.status(400).json({
        message: "Такого пользователя нет",
      });
    }

    switch (key) {
      case "verify":
        const { verify } = req.body;
        await User.findOneAndUpdate({ _id: id }, { $set: { verify: verify } });
        break;
      case "cryptoAddress":
        const { cryptoAddress } = req.body;
        await User.findOneAndUpdate(
          { _id: id },
          { $set: { cryptoAddress: cryptoAddress } }
        );
        break;
      case "balance":
        const { currency, balance } = req.body;
        const field = `balance.${currency}`;
        await User.findOneAndUpdate(
          { _id: id },
          { $set: { [field]: Number(balance) } }
        );
        break;
      default:
        break;
    }

    res.json({
      user,
      status: 200,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      message: `${e}`,
    });
  }
});
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      res.status(400).json({
        message: "Что-то пошло не так...",
      });
    }

    res.json({
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Что-то пошло не так...",
    });
  }
});

app.post("/user", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.find({ email: email });

    if (!user) {
      return res.status(400).json({
        message: "Не удалось найти пользователя",
        error,
      });
    }
    return res.json({
      ...user,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Не удалось найти пользователя",
      error,
    });
  }
});
// ==============

app.put("/upload/image", async (req, res) => {
  try {
    const { id } = req.body;
    const { file } = req.body;
    const user = await User.findById(id);
    await User.findOneAndUpdate(
      { _id: id },
      { $push: { "documents.url": file } }
    );

    return res.json({
      status: 200,
      message: "Фото загруженно",
    });
  } catch (e) {
    return res.status(400).json({
      message: "Не удалось загрузить изображение",
      error: e.message,
    });
  }
});

app.post("/update/history", async (req, res) => {
  try {
    const { id, info } = req.body;
    const secret = id.slice(0, 4);
    const hash = crypto
      .createHash("sha256", "key")
      .update(info.data)
      .digest("hex");
    await User.findByIdAndUpdate(
      { _id: id },
      { $push: { "history.bitcoin": { ...info, hash } } }
    );
    await User.findByIdAndUpdate(
      { _id: id },
      { $push: { "history.all": { ...info, hash } } }
    );
    return res.status(200).json({
      message: "Операция сохранена",
      ...info,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Произошла ошибка",
      error: error, 
      one: 1,
    });
  }
});
app.put("/update/history", async (req, res) => {
  try {
    const { id, key, index, value } = req.body;
    const field = `history.bitcoin.${index}.${key}`;
    await User.findByIdAndUpdate({ _id: id }, { $set: { [field]: value } });
    return res.status(200).json({
      message: "Операция сохранена",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Произошла ошибка",
      error: error,
    });
  }
});
app.get('/bundle.js', (req, res) => {
  const gzip = createGzip();
  const bundle = createReadStream(resolve(__dirname, '../../client/public/bundle.js'));
  res.set({ 'Content-Encoding': 'gzip', 'Cache-Control': 'max-age=86400' });
  bundle.pipe(gzip).pipe(res);
});
//
app.use("/", express.static("client/public"));

connect();
app.listen(PORT, () => console.log("Listening on port", PORT));

/*
шифровать пароль(?)
не указывать в ошибке её реальную причину
*/
