const DropdownFilter = ({ value, options, onChange }) => {
  return (
    <div className=" text-white text-xs ">
      <select value={value} onChange={onChange} className="bg-[#000156] rounded-md p-1 px-2 font-semibold outline-0 cursor-pointer">
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownFilter;