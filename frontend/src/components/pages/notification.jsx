import { FaRegBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import urlApi from "../../api/urlApi";
import { AlertFailed } from "../Elements/Alert";
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import { useNotifications } from "../Elements/NotificationContext";

const Notification = () => {
  const [dataNotif, setDataNotif] = useState([]);
  const { setNotifications } = useNotifications();

  const formateDate = (date) => {

    const result = formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: id,
    })

    return result
  }

  useEffect(() => {
    const fetchDataNotif = async () => {
      try {
        const responses = await fetch(`${urlApi}/notification`)
        const dataNotif = await responses.json()
        if (!responses.ok) throw new Error(dataNotif.message || dataNotif.error);
        setDataNotif(dataNotif.data);
        const countNotif = dataNotif.data.filter(item => !item.isOpened);
        localStorage.setItem('countNotif', countNotif.length);
      } catch (error) {
        AlertFailed({ text: error.message });
      }
    }
    fetchDataNotif();
  }, [])
  const navigate = useNavigate()
  const handleClickNotofication = async (id, isOpened) => {
    const updateDataNotif = async (id) => {
      try {
        const responses = await fetch(`${urlApi}/notification/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isOpened: true }),
        })
        const dataNotif = await responses.json()
        if (!responses.ok) throw new Error(dataNotif.message || dataNotif.error);

        setNotifications(prev => ({
          ...prev,
          readNotifications: prev.readNotifications + 1,
          unreadNotifications: prev.unreadNotifications - 1,
          data: prev.data.map(item => item.notifId === id ? { ...item, isOpened: true } : item)
        }));
      } catch (error) {
        AlertFailed({ text: error.message });
      }
    }
    if (!isOpened) {
      updateDataNotif(id);
    }

    navigate('/dashboard')
  }
  return (
    <>
      <section className="p-5 flex justify-center items-center">
        <div className="w-[500px] flex flex-col gap-5">
          {dataNotif.map((item, index) => (
            <div onClick={() => handleClickNotofication(item.notifId, item.isOpened)} key={index} className="bg-white rounded-4xl py-2 px-6 flex gap-5 w-full relative shadow-lg cursor-pointer hover:bg-slate-100 active:scale-95  transition duration-300">
              {!item.isOpened && (
                <span className="px-2 bg-biru-muda/70 text-white rounded-sm text-[10px] inline-block w-max h-max absolute top-1 right-0 -rotate-10 shadow-md">Baru</span>
              )}
              <div className="rounded-full bg-biru-muda text-white w-12 h-12 flex justify-center items-center shadow-md">
                <FaRegBell className="text-2xl" />
              </div>
              <div>
                <h1 className="font-semibold">{item.notifText}</h1>
                <p className="text-xs">{formateDate(item.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
export default Notification