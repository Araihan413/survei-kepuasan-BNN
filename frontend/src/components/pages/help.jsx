import PDFViewer from "../Elements/PDFViewer"
import { FaPhone } from "react-icons/fa6";


const Help = () => {
  const phoneNumber = '6287863556733'; // Ganti dengan nomor tujuan (format: 628...)
  const message = 'Halo, Bisa minta bantuannya ?'; // Pesan default (opsional)
  const handleToCall = () => {
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  }
  return (
    <>
      <div className="flex justify-center items-center p-5">
        <div className="bg-white rounded-xl flex flex-col gap-5  w-full p-5">
          <div className="text-start mb-5">
            <h1 className="text-lg font-bold text-gray-700">Bantuan</h1>
          </div>
          <div className="flex justify-center items-center">
            <PDFViewer url="file/Panduan.pdf" />
          </div>
        </div>
        <div className="bg-biru-muda w-14 h-14 flex justify-center items-center fixed bottom-14 right-12 p-3 rounded-full cursor-pointer active:scale-95 active:bg-biru-muda/80">
          <button type="button" className="text-white cursor-pointer text-xl" onClick={handleToCall}>
            <FaPhone />
          </button>
        </div>
      </div>
    </>
  )
}
export default Help