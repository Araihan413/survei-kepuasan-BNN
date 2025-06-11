import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import toast from 'react-hot-toast';

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

const AlertNewSurvey = ({ name }) => toast.success(`Survei baru masuk dari ${name}`, {
  duration: 5000,
  position: "top-right"
});

export { AlertDelete, AlertSuccess, AlertFailed, AlertNewSurvey, AlertComfirm };