import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import toast from 'react-hot-toast';
import { FaUserCircle } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5'; // Icon close

const MySwal = withReactContent(Swal);

const AlertDelete = async ({
  title = 'Yakin?',
  text = 'Tindakan ini tidak bisa dibatalkan!',
  confirmButtonText = 'Ya',
  cancelButtonText = 'Batal',
}) => {
  const result = await MySwal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#aaa',
    confirmButtonText,
    cancelButtonText,
  });

  return result.isConfirmed;
};

const AlertComfirm = async ({
  title = 'Yakin?',
  text = 'Apakah Ingin Melanjutkan?',
  confirmButtonText = 'Ya',
  cancelButtonText = 'Tidak',
}) => {
  const result = await MySwal.fire({
    title,
    text,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#aaa',
    confirmButtonText,
    cancelButtonText,
  });

  return result.isConfirmed;
};

const AlertSuccess = ({ text }) => toast.success(text);

const AlertFailed = ({ text }) => toast.error(text);

const AlertNewSurvey = ({ respondentName, date }) => {
  toast((t) => (
    <div className="flex items-center justify-between gap-3 p-4 pr-0 w-full">
      <div className="flex items-center gap-3 border-r-1 border-gray-500 pr-4">
        <FaUserCircle className="text-4xl text-white bg-blue-500 rounded-full p-1" />
        <div>
          <p className="font-semibold text-black">Survei Baru Diterima!</p>
          <p className="text-black text-sm">Dari : {respondentName}</p>
          <p className="text-xs text-gray-500">
            {new Date(date).toLocaleString()}
          </p>
        </div>
      </div>
      <button
        onClick={() => toast.dismiss(t.id)}
        className="text-gray-700 hover:text-black rounded-full pl-1 pr-2 cursor-pointer"
      >
        <IoClose className="text-lg" />
      </button>
    </div>
  ), {
    duration: 7000,
    position: 'top-center',
    icon: null,
    style: {
      background: '#fff',
      borderRadius: '10px',
      padding: '0px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      color: '#000',
      maxWidth: '400px'
    }
  });
};

const AlertTokenExpired = async ({
  title = 'Ups! Akses Anda Habis',
  text = 'Silahkan Login Kembali',
  confirmButtonText = 'Oke',
} = {}) => {
  const result = await MySwal.fire({
    title,
    text,
    icon: "warning", // bisa diganti dengan "info", "error", dll
    confirmButtonColor: '#d33',
    confirmButtonText,
  });

  return result.isConfirmed;
};


export { AlertDelete, AlertSuccess, AlertFailed, AlertNewSurvey, AlertComfirm, AlertTokenExpired };