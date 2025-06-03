const answerService = require("./answer.service");
const { verifyToken } = require("../middleware/auth.middleware");
const express = require("express");
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const createAnswer = await answerService.createManyAnswerAndRespondent(data);
    res.status(201).json({
      status: "success",
      message: "Data answer berhasil di tambahkan",
      data: createAnswer,
    });
  } catch (error) { 
    res.status(400).json({
      status: "error",
      message: error.message,
      error: error,
    });
  }
})

module.exports = router