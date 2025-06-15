const prisma = require("../config");

const insertManyOption = (newDataOption) => {
  const newOption = prisma.option.createMany({
    data: newDataOption,
  });
  return newOption;
};

const deleteManyOption = (optionChanges) => {
  const deleteOption = prisma.option.deleteMany({
    where: { optionId: { in: optionChanges.toDelete } },
  });
  return deleteOption;
};

const updateOptionById = (id, optionData) => {
  const option = prisma.option.update({
    where: {
      optionId: id,
    },
    data: optionData,
  });
  return option;
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

module.exports = { insertManyOption, getOptionByQuestionId, deleteManyOption, updateOptionById };