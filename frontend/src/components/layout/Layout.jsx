import { Outlet } from "react-router-dom";
import Navbar from "../Fragments/Navbar";
import NavbarTop from "../Fragments/NavbarTop";
import socket from "../../socket";
import { useEffect } from "react";
import { AlertNewSurvey } from "../Elements/Alert";

const Layout = () => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Terhubung ke WebSocket:", socket.id);
    });

    socket.on("new-survey", (data) => {
      const name = data.biodata?.name || "pengguna anonim";
      AlertNewSurvey(name);
    });

    return () => {
      socket.off("connect");
      socket.off("new-survey");
      socket.disconnect(); // optional jika ingin lepas koneksi saat pindah halaman
    };
  }, []);

  return (
    <>
      <div className="bg-slate-100 min-h-screen flex relative box-border">
        <NavbarTop />
        <Navbar />
        <main className="w-full mt-16 ml-53.5">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;
