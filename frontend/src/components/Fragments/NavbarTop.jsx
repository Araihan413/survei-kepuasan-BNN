import { FaRegBell } from "react-icons/fa6";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../AuthContext";
import { useContext } from "react";
import Breadcrumb from "../Elements/Breadcrumb";

const NavbarTop = () => {
  const { admin } = useContext(AuthContext);
  const navigasi = useNavigate();
  const handleToProfil = () => {
    navigasi("/profil");
  }

  const handleToNotification = () => {
    navigasi("/notifikasi");
  }

  const cutTeks = (teks, maxLength = 15) => {
    if (!teks) return "";
    return teks.length > maxLength ? teks.slice(0, maxLength) + "..." : teks;
  };
  return (
    <>
      <nav className="flex justify-between items-center fixed top-0 left-0 right-0 z-30 bg-white px-5 py-3 pr-12 shadow-md">
        <div className="ml-56 ">
          <Breadcrumb />
        </div>
        <div className="flex items-center gap-6">
          <button onClick={handleToNotification} className="text-[#dfb400] text-xl bg-[#fff8da]/50 p-2 rounded-md cursor-pointer">
            <FaRegBell />
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