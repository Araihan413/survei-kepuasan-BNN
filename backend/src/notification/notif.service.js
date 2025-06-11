const notificationRepository = require("./notif.repository");

const createNotification = async (data) => {
  const dataNotif = {
    notifText: data.notifText,
    notifType: data.notifType,
  }
  return await notificationRepository.insertNotification(dataNotif);
};

const getAllNotification = async () => {
  return await notificationRepository.findNotification();
};

const deleteNotificationById = async (id) => {
  const notification = await notificationRepository.deleteNotification(id);
  if (!notification) throw new Error("data notification tidak ditemukan");
  return notification;
};

const updateNotificationById = async (id, data) => {
  const dataNotif = {
    isOpened: data.isOpened
  }
  const notification = await notificationRepository.updateNotification(id, dataNotif);
  if (!notification) throw new Error("data notification tidak ditemukan");
  return notification;
}
module.exports = { createNotification, getAllNotification, deleteNotificationById, updateNotificationById };