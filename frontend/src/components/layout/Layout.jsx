import Navbar from "../Fragments/Navbar"
import NavbarTop from "../Fragments/NavbarTop"
import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <>
      <div className="bg-slate-100 h-max flex relative">
        <NavbarTop />
        <Navbar />
        <main className="w-full mt-16 ml-58">
          <Outlet />
        </main>
      </div>
    </>
  )
}
export default Layout