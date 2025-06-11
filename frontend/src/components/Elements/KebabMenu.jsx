import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { CiMenuKebab } from "react-icons/ci";
import { useState } from 'react';
import { AlertDelete } from './Alert';

const KebabMenu = ({ onEdit, onDelete, onDetail }) => {

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    handleClose();
    onEdit(); // panggil fungsi dari parent
  };

  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    handleClose();
    const confirmed = await AlertDelete({
      title: 'Hapus Survei?',
      text: 'Data survei termasuk pertanyaan di dalamnya akan hilang selamanya!',
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
    });

    if (!confirmed) return;
    onDelete(); // panggil fungsi dari parent
  };

  const handleDetailClick = (e) => {
    e.stopPropagation();
    handleClose();
    onDetail(); // panggil fungsi dari parent
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <CiMenuKebab className='font-bold text-black' />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleEditClick} sx={{ justifyContent: 'center', textAlign: 'center', fontSize: '12px' }}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ justifyContent: 'center', textAlign: 'center', fontSize: '12px' }}>Hapus</MenuItem>
        <MenuItem onClick={handleDetailClick} sx={{ justifyContent: 'center', textAlign: 'center', fontSize: '12px' }}>Detail</MenuItem>
      </Menu>
    </div>
  );
}
export default KebabMenu