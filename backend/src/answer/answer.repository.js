const prisma = require("../config");


const insertManyAnswer = async (data) => {
  return await prisma.answer.createMany({
    data: data,
  });
};

const insertRespondent = async (data) => {
  return await prisma.respondent.create({
    data: data,
  });
};

module.exports = { insertManyAnswer, insertRespondent };