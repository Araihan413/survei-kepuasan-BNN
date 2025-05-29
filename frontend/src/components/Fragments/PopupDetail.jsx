import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography
} from '@mui/material';

const PopupDetail = ({
  open,
  onClose,
  formConfig,
  data,
  title = "Detail Data",
  onEdit // Tambahkan prop onEdit untuk tombol edit
}) => {
  const renderDetailField = (field) => {
    // Format value jika ada formatter
    const value = field.format
      ? field.format(data?.[field.name])
      : data?.[field.name] || '-';

    return (
      <Box key={field.name} sx={{ mb: 2 }}>
        {/* Label */}
        <Typography
          variant="subtitle2"
          color="textSecondary"
          sx={{ mb: 0.5 }}
        >
          {field.label}
        </Typography>

        {/* Value - bisa menggunakan TextField disabled atau Typography */}
        <TextField
          fullWidth
          variant="outlined"
          value={value}
          disabled
          sx={{
            '& .MuiInputBase-input.Mui-disabled': {
              color: 'rgba(0, 0, 0, 0.87)',
              WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
              cursor: 'default'
            },
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.02)'
            }
          }}
        />
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {formConfig.map(field => renderDetailField(field))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Tutup</Button>
        {onEdit && (
          <Button
            onClick={onEdit}
            variant="contained"
            color="primary"
          >
            Edit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PopupDetail;