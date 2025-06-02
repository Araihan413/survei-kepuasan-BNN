const Button = ({ type, text = '', onClick = () => { }, color = '', style = 'text-black', icon = '', disabled = false }) => {
  return (
    <>
      <div>
        <button disabled={disabled} onClick={onClick} type={type} className={`${color} ${style} w-full max-w-90 font-semibold py-2 px-4 rounded-2xl cursor-pointer shadow-md flex gap-2 items-center justify-center`}>{icon}{text}</button>
      </div>
    </>
  )
}
export default Button