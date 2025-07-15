import { createContext, useContext, useState, useEffect } from 'react';
import urlApi from '../../api/urlApi';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {

  const [notifications, setNotifications] = useState({});

  const fetchDataNotif = async () => {
    try {
      const responses = await fetch(`${urlApi}/notification`)
      const dataNotif = await responses.json()
      if (!responses.ok) throw new Error(dataNotif.message || dataNotif.error);

      setNotifications({
        readNotifications: dataNotif.data.filter((notification) => notification.isOpened).length,
        unreadNotifications: dataNotif.data.filter((notification) => !notification.isOpened).length,
        data: dataNotif.data.map((notification) => ({ notifId: notification.notifId, notifText: notification.notifText, isOpened: notification.isOpened }))
      });
    } catch (error) {
      AlertFailed({ text: error.message });
    }
  }

  useEffect(() => {
    fetchDataNotif()
  }, []);

  const addNewNotification = (newNotif) => {
    setNotifications((prev) => ({
      readNotifications: prev.readNotifications,
      unreadNotifications: prev.unreadNotifications + 1,
      data: [newNotif, ...prev.data]
    }));
  };


  return (
    <NotificationContext.Provider value={{ notifications, setNotifications, addNewNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook
export const useNotifications = () => useContext(NotificationContext);
