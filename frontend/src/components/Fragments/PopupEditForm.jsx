import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box
} from '@mui/material';
import { useForm } from "react-hook-form";
import { useEffect } from 'react';

const PopupEditForm = ({
  open,
  onClose,
  formConfig,
  initialData,
  onSubmit,
  title = "Edit Data"
}) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset
  } = useForm({
    defaultValues: initialData || {}
  });

  useEffect(() => {
    reset(initialData || {});
  }, [initialData, reset]);

  const renderFormField = (field) => {
    if (field.readOnly) {
      return (
        <TextField
          key={field.name}
          margin="dense"
          label={field.label}
          fullWidth
          variant="outlined"
          value={initialData?.[field.name] || ''}
          disabled
          sx={{
            '& .MuiInputBase-input.Mui-disabled': {
              color: 'rgba(0, 0, 0, 0.87)', // Warna teks untuk disabled field
              WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)' // Untuk browser Webkit
            }
          }}
        />
      );
    }

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <TextField
            key={field.name}
            margin="dense"
            label={field.label}
            fullWidth
            variant="outlined"
            type={field.type}
            {...register(field.name, field.validation)}
            error={!!errors[field.name]}
            helperText={errors[field.name]?.message}
          />
        );

      case 'select':
        return (
          <FormControl fullWidth margin="dense" key={field.name}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              label={field.label}
              {...register(field.name, field.validation)}
              error={!!errors[field.name]}
            >
              {field.options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors[field.name] && (
              <span style={{ color: 'red', fontSize: '0.75rem' }}>
                {errors[field.name].message}
              </span>
            )}
          </FormControl>
        );

      // Tambahkan tipe field lainnya sesuai kebutuhan
      default:
        return null;
    }
  };

  return (
    <>
      <div>
        {/* Dialog (popup edit) */}
        <Dialog open={open} onClose={onClose}>
          <DialogTitle>Edit Data</DialogTitle>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              {formConfig.map(field => renderFormField(field))}
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Batal</Button>
              <Button type="submit" variant="contained" color="primary">
                Simpan
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </div>
    </>
  )
}
export default PopupEditForm