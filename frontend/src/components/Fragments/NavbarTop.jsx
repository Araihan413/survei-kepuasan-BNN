import { FaRegBell } from "react-icons/fa6";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../AuthContext";
import { useContext, useState, useEffect } from "react";
import Breadcrumb from "../Elements/Breadcrumb";
import urlApi from "../../api/urlApi";

const NavbarTop = ({ logo = false, notificationCount }) => {
  const [countNotifNew, setCountNotifNew] = useState(0)
  const { admin } = useContext(AuthContext);
  const navigasi = useNavigate();
  const handleToProfil = () => {
    navigasi("/profil");
  }

  const handleToNotification = () => {
    navigasi("/notifikasi");
  }

  const fetchData = async () => {
    try {
      const responses = await fetch(`${urlApi}/notification`)
      const dataNotif = await responses.json()
      if (!responses.ok) throw new Error(dataNotif.message || dataNotif.error)
      const notifNew = dataNotif.data.filter(notif => notif.isOpened === false)
      setCountNotifNew(notifNew.length)
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchData()
  }, [notificationCount])

  const cutTeks = (teks, maxLength = 15) => {
    if (!teks) return "";
    return teks.length > maxLength ? teks.slice(0, maxLength) + "..." : teks;
  };
  return (
    <>
      <nav className="flex justify-between items-center fixed top-0 left-0 right-0 z-30 bg-white px-5 py-3 pr-12 shadow-md">
        <div className="flex items-center">
          {logo ? (
            <div className="flex gap-3 items-center  left-5 cursor-pointer" onClick={() => navigasi("/dashboard")}>
              <img className="w-10" src="/aset/logo/logoBnn.png" alt="logo bnn" />
              <h1 className="text-xl font-bold">SIGAP BNN</h1>
            </div>
          ) : null}
          <div className={`${logo ? "ml-20" : "ml-56"}`}>
            <Breadcrumb />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={handleToNotification} className="text-[#dfb400] text-xl bg-[#fff8da]/50 p-2 rounded-md cursor-pointer relative">
            <FaRegBell />
            {(countNotifNew > 0) && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {countNotifNew}
              </span>
            )}
          </button>
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleToProfil}>
            <div className="w-10 h-10 rounded-xl ">
              <img src="../aset/profile/profileDefault.png" alt="gambar profile" />
            </div>
            <div className="flex items-start gap-3">
              <div>
                <h1 className="font-semibold text-sm">{cutTeks(admin?.name)}</h1>
                <p className="text-xs">{admin?.role}</p>
              </div>
              <div className="mt-1">
                <MdKeyboardArrowDown />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
export default NavbarTop