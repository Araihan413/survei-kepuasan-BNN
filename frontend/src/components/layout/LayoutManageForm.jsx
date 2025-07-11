import { Outlet } from "react-router-dom";
import NavbarTop from "../Fragments/NavbarTop";
import socket from "../../socket";
import { useEffect } from "react";
import { AlertNewSurvey } from "../Elements/Alert";
import { useNotifications } from "../Elements/NotificationContext";

const Layout = () => {
  const { addNewNotification } = useNotifications();
  const { notifications } = useNotifications();

  useEffect(() => {
    // Handler untuk new survey
    const onNewSurvey = (dataRespondent) => {
      const respondentName = dataRespondent.data.name || "Responden Anonim";
      const date = dataRespondent.data.timestamp || new Date().toISOString()

      if (dataRespondent) {
        AlertNewSurvey({ respondentName: respondentName, date: date })
        const newNotif = {
          notifText: `${respondentName} telah mengisi survei.`,
          isOpened: false,
        };

        addNewNotification(newNotif); // update context
      }


    };

    // Pasang event listeners
    socket.on('connect', () => console.log("Connected to WebSocket"));
    socket.on('new-survey', onNewSurvey);

    // Connect socket jika belum terhubung
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off('new-survey', onNewSurvey);
      socket.off('connect');
    };
  }, []);

  return (
    <>
      <div className="bg-slate-100 min-h-screen flex relative box-border">
        <NavbarTop logo={true} notificationCount={notifications.unreadNotifications} />
        <main className="w-full">
          <Outlet context={{ socket }} />
        </main>
      </div>
    </>
  );
};

export default Layout;
