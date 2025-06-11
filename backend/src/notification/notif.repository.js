const prisma = require("../config");

const insertNotification = async (data) => {
  return await prisma.notification.create({
    data: data,
  });
};

const deleteNotification = async (id) => {
  return await prisma.notification.delete({
    where: {
      notifId: id,
    },
  });
};

const findNotification = async () => {
  return await prisma.notification.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });
};

const updateNotification = async (id, data) => {
  return await prisma.notification.update({
    where: {
      notifId: id,
    },
    data: data,
  });
};

module.exports = { insertNotification, findNotification, deleteNotification, updateNotification };