import { useState, useRef, useEffect } from 'react';
import { CiMenuKebab } from 'react-icons/ci';
import { MdEdit, MdDelete, MdInfo } from 'react-icons/md';
import { AlertDelete } from './Alert';

const KebabMenu = ({ onEdit, onDelete, onDetail }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    if (!open) {
      // Kirim event untuk menutup semua kebab lain
      document.dispatchEvent(new CustomEvent("close-all-kebab"));
    }
    setOpen((prev) => !prev);
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("close-all-kebab", () => setOpen(false));
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("close-all-kebab", () => setOpen(false));
    };
  }, []);

  const handleEdit = (e) => {
    e.stopPropagation();
    setOpen(false);
    onEdit();
  };

  const handleDetail = (e) => {
    e.stopPropagation();
    setOpen(false);
    onDetail();
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setOpen(false);
    const confirmed = await AlertDelete({
      title: 'Hapus Survei?',
      text: 'Data survei termasuk pertanyaan di dalamnya akan hilang selamanya!',
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
    });
    if (confirmed) onDelete();
  };

  return (
    <div className="relative flex justify-center items-center" ref={menuRef}>
      <button onClick={toggleMenu} className="p-2 hover:bg-gray-200 rounded-full cursor-pointer">
        <CiMenuKebab className="text-black text-lg" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white border-gray-300 rounded-md overflow-hidden shadow-md z-20">
          <div
            onClick={handleEdit}
            className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer border-b-1 border-gray-300"
          >
            <MdEdit className="mr-2" /> Edit
          </div>
          <div
            onClick={handleDetail}
            className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer border-b-1 border-gray-300"
          >
            <MdInfo className="mr-2" /> Detail
          </div>
          <div
            onClick={handleDelete}
            className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer border-b-1 border-gray-300"
          >
            <MdDelete className="mr-2" /> Hapus
          </div>
        </div>
      )}
    </div>
  );
};

export default KebabMenu;
