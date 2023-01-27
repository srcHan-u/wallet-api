"use strict";

var _docModel = require("../doc/docModel");
const fs = require("fs");
async function uploadFile(req, res) {
  try {
    const {
      files,
      id
    } = req;
    // const parent = await File.fin
    const user = await _docModel.User.findById(id);
    if (!user) {
      return res.status(400).json({
        message: "Can not find a user"
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Upload error"
    });
  }
}