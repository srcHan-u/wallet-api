import { utils } from "./utils";

const getOne = (model) => async (req, res) => {
  try {
    const user = await model.findOne({
        email: req.body.email
    })
    if (!user) {
        return res.status(400).json({
            message: "Sorry but we haven't this user"
        })
    }
    return user
  } catch (err) {
    console.error(1);
    res.sendStatus(400);
  }
};

const getMany = (model) => async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
};

const createOne = (model) => async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось зарегистрироваться!",
    });
  }
};

const updateOne = (model) => async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
};

const deleteOne = (model) => async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
};

export const crud = (model) => ({
  getOne: getOne(model),
  getMany: getMany(model),
  createOne: createOne(model),
  updateOne: updateOne(model),
  deleteOne: deleteOne(model),
});
