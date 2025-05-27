import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';


const DropdownColor = ({ value, options, handleChange, label }) => {
  return (
    <>
      <FormControl fullWidth size="small">
        <InputLabel className='text-xs'>{label}</InputLabel>
        <Select value={value} label={label} onChange={handleChange} className="text-sm bg-white w-28 h-8 pt-2" MenuProps={{
          PaperProps: {
            className: 'text-xs',
          },
        }}>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <div className='flex items-center gap-2 text-xs'>
                {option.icon}
                {option.label}
              </div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}
export default DropdownColor