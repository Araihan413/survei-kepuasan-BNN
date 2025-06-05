const prisma = require("../config");

const insertOption = (newDataOption) => {
  const newOption = prisma.option.create({
    data: newDataOption,
  });
  return newOption;
};

const getOptionByQuestionId = (id) => {
  const option = prisma.option.findMany({
    where: {
      questionId: id,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
  return option;
};

module.exports = { insertOption, getOptionByQuestionId };