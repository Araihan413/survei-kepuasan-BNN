import { Outlet } from "react-router-dom";
import Navbar from "../Fragments/Navbar";
import NavbarTop from "../Fragments/NavbarTop";
import socket from "../../socket";
import { useEffect, useState } from "react";
import { AlertNewSurvey } from "../Elements/Alert";

const Layout = () => {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Handler untuk new survey
    const onNewSurvey = (dataRespondent) => {
      const respondentName = dataRespondent.data.name || "Responden Anonim";
      const date = dataRespondent.data.timestamp || new Date().toISOString()

      if (dataRespondent) {
        AlertNewSurvey({ respondentName: respondentName, date: date })
        setNotificationCount(prev => prev + 1);
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
        <NavbarTop notificationCount={notificationCount} />
        <Navbar />
        <main className="w-full mt-16 ml-53.5">
          <Outlet context={{ socket }} />
        </main>
      </div>
    </>
  );
};

export default Layout;
