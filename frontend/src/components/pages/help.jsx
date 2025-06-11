import PDFViewer from "../Elements/PDFViewer"
import { FaPhone } from "react-icons/fa6";


const Help = () => {
  const handleToCall = () => {
    console.log("call to wa")
  }
  return (
    <>
      <div className="flex justify-center items-center px-5 py-10">
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