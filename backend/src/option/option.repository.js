const prisma = require("../config");

const insertOption = (newDataOption) => {
  const newOption = prisma.option.create({
    data: newDataOption,
  });
  return newOption;
};


module.exports = { insertOption };