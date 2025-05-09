const express = require('express');
const questionController = require('./questions/question.controller')

const app = express();
const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT;
app.use(express.json())

app.use('/questions', questionController)

app.listen(PORT, (req,res) => {
  console.log('server running in port : http://localhost:2100')
})

