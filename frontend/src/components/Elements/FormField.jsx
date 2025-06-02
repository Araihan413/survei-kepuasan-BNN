const FormField = (proms) => {
  const { name, label = "", type = 'text', placeholder = 'Masukkan data', icon: Icon = null, reqired = false } = proms
  return (
    <>
      <div className="flex flex-col relative ">
        {label && <label htmlFor={name}>{label}</label>}
        {Icon && <Icon className="absolute opacity-90 left-3 top-1/2 -translate-y-1/2 text-[#5d5d5d] text-xl" />}
        <input className="pl-10 border-1 pr-3 py-4 text-sm outline-none shadow-md rounded-2xl border-gray-300/50" id={name} type={type} placeholder={placeholder} required={reqired} />
      </div>
    </>
  )
}
export default FormField 