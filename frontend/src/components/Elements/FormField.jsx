const FormField = (proms) => {
  const { name, label, type = 'text', placeholder = 'Masukkan data' } = proms
  return (
    <>
      <div className="flex flex-col">
        <label htmlFor={name}>{label}</label>
        <input className="border-1 rounded-sm px-2 py-1 text-sm" id={name} type={type} placeholder={placeholder} />
      </div>
    </>
  )
}
export default FormField 