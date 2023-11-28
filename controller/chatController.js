require("express/lib/application");
const chatmodel = require("../models/chatModel");

const methodPost = async (req, res) => {// req utk baca data yang dikirim, res untuk hasil
  console.log(req.body);
  try {
    const { username, text } = req.body; //akan ambil body dari script js

    const fileContent = req.files != undefined ? req.files[0] : undefined
    const file = fileContent != undefined ? fileContent.path : ""
    const filename = fileContent != undefined ? fileContent.filename : ""
    const store = new chatmodel({
      username: username,
      text: text,
      file: file,
      filename: filename
    });

    await store.save();
    res.status(200).send("berhasil disimpan");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("error bosque");
  }
};

const methodGet = async (req, res) => {
  try {
    const getData = await chatmodel.findAll({});
    res.json(getData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("error bosque");
  }
};

module.exports = {
  methodPost,
  methodGet,
};
