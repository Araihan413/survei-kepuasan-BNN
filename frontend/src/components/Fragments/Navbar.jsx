import { AiFillPieChart } from "react-icons/ai";
import { GoGraph } from "react-icons/go";
import { LuClipboardList } from "react-icons/lu";
import { HiPencil } from "react-icons/hi2";
import { FaHeadset } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
const Navbar = () => {
  return (
    <>
      <nav>
        <div>
          <img src="" alt="" />
          <h1>SIGAP BNN</h1>
        </div>
        <div>
          <ul>
            <li>
              <div className="flex items-center gap-3"><AiFillPieChart /><h1>DashBoard</h1></div>
            </li>
            <li>
              <div className="flex items-center gap-3"><GoGraph /><h1>Analisis</h1></div>
            </li>
            <li>
              <div className="flex items-center gap-3"><LuClipboardList /><h1>Survei</h1></div>
            </li>
            <li>
              <div className="flex items-center gap-3"><HiPencil /><h1>Kelola Pertanyaan</h1></div>
            </li>
            <li>
              <div className="flex items-center gap-3"><HiPencil /><h1>Kelola Layanan</h1></div>
            </li>
            <li>
              <div className="flex items-center gap-3"><FaHeadset /><h1>Bantuan</h1></div>
            </li>
            <li>
              <div className="flex items-center gap-3"><RiLogoutBoxRLine /><h1>Keluar</h1></div>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}
export default Navbar