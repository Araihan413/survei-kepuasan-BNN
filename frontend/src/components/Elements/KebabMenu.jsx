import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { CiMenuKebab } from "react-icons/ci";
import { useState } from 'react';

const KebabMenu = ({ onEdit, onDelete, onDetail }) => {

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEditClick = () => {
    handleClose();
    onEdit(); // panggil fungsi dari parent
  };

  const handleDeleteClick = () => {
    handleClose();
    onDelete(); // panggil fungsi dari parent
  };

  const handleDetailClick = () => {
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