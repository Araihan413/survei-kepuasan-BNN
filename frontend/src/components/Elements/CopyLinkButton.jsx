import { AlertSuccess, AlertFailed } from '../Elements/Alert';
import { IoLink } from "react-icons/io5";

const CopyLinkButton = ({ text = '', simple = false }) => {
  const handleCopy = () => {
    const baseUrl = `${window.location.origin}`; // ← otomatis ambil "http://localhost:5173/"
    const urlToCopy = `${baseUrl}/surveiBNN`; // ← kamu tinggal tambahkan path-nya
    navigator.clipboard.writeText(urlToCopy)
      .then(() => {
        AlertSuccess({ text: 'Link berhasil disalin!' });
      })
      .catch(err => {
        AlertFailed({ text: 'Gagal menyalin:' });
      });
  };

  return (
    <>
      {simple ? (
        <button onClick={handleCopy} className='flex gap-2 justify-center items-center cursor-pointer text-gray-700 font-semibold '>
          <IoLink className='text-2xl hover:text-biru-muda' />
        </button>
      ) : (
        <button onClick={handleCopy} className='flex gap-2 justify-center items-center px-3 py-1 border-1 border-gray-300 cursor-pointer text-gray-700 hover:bg-gray-100 shadow-md rounded-xl font-semibold hover:text-biru-muda'>

          <IoLink className='text-lg' />
          {text}
        </button>
      )}
    </>
  );
};

export default CopyLinkButton;
