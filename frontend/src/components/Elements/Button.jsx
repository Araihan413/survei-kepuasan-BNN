const Button = ({ type, text, onClick = '', color = 'bg-slate-200', style = 'text-black', icon = '' }) => {
  return (
    <>
      <div>
        <button onClick={onClick} type={type} className={`${color} ${style} w-full max-w-90 font-semibold py-2 px-4 rounded-2xl cursor-pointer`}>{icon}{text}</button>
      </div>
    </>
  )
}
export default Button