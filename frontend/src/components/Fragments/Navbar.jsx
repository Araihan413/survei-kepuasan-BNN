import { AiFillPieChart } from "react-icons/ai";
import { GoGraph } from "react-icons/go";
import { LuClipboardList } from "react-icons/lu";
import { HiPencil } from "react-icons/hi2";
import { FaHeadset } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigasi = useNavigate()
  const navItems = [
    { name: "DashBoard", path: "/dashboard", icon: <AiFillPieChart /> },
    { name: "Analisis", path: "/analisis", icon: <GoGraph /> },
    { name: "Survei", path: "/survei", icon: <LuClipboardList /> },
    { name: "Kelola Pertanyaan", path: "/kelola-pertanyaan", icon: <HiPencil /> },
    { name: "Kelola Layanan", path: "/kelola-layanan", icon: <HiPencil /> },
    { name: "Bantuan", path: "/bantuan", icon: <FaHeadset /> },

  ];
  return (
    <>
      <nav className="bg-white pr-1 pl-5 pt-5.5 z-50 fixed h-screen overflow-y-scroll">
        <div className="flex gap-3 items-center mb-8 mr-4 cursor-pointer" onClick={() => navigasi("/dashboard")}>
          <img className="w-10" src="/aset/logo/logoBnn.png" alt="logo bnn" />
          <h1 className="text-xl font-bold">SIGAP BNN</h1>
        </div>
        <div>
          <ul className="flex flex-col gap-3">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2.5 rounded-xl pl-4 hover:bg-blue-800/90 hover:text-white ${isActive ? "bg-blue-800/90 text-white" : "text-gray-700"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="text-base">
                        {item.icon}
                      </div>
                      <h1 className={`text-sm ${isActive ? "font-semibold" : "font-normal"}`}>{item.name}</h1>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
            <li onClick={() => navigasi("/login")}>
              <NavLink className="flex items-center gap-3 py-2.5 rounded-xl pl-4 hover:bg-blue-800/90 hover:text-white text-gray-700">
                <div className="text-base">
                  <RiLogoutBoxRLine />
                </div>
                <h1 className="text-sm font-normal">Keluar</h1>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}
export default Navbar