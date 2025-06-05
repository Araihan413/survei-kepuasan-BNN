import { FaRegBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const navigate = useNavigate()
  const dataNotif = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  const handleClickNotofication = () => {
    navigate('/dashboard')
  }
  return (
    <>
      <section className="p-5 flex justify-center items-center">
        <div className="w-[500px] flex flex-col gap-5">
          {dataNotif.map((item, index) => (
            <div className="bg-white rounded-4xl py-2 px-6 flex gap-5 w-full relative shadow-lg cursor-pointer hover:bg-slate-100 active:scale-95  transition duration-300" onClick={handleClickNotofication}>
              {item % 2 === 0 && (
                <span className="px-2 bg-biru-muda/70 text-white rounded-sm text-[10px] inline-block w-max h-max absolute top-1 right-0 -rotate-10 shadow-md">Baru</span>
              )}
              <div className="rounded-full bg-biru-muda text-white w-12 h-12 flex justify-center items-center shadow-md">
                <FaRegBell className="text-2xl" />
              </div>
              <div>
                <h1 className="font-semibold">Samsul Telah Melakukan Survey</h1>
                <p className="text-xs">27 Meniy Yang lalu</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
export default Notification