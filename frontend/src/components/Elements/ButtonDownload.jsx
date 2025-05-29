const ButtonDownload = ({ type = 'button', text = '', onClick = '', color = 'bg-white', icon = '', style = '' }) => {
  return (
    <>
      <div className="w-max">
        <button onClick={onClick} type={type} className={`${color} ${style} active:bg-slate-100/70 flex justify-center items-center gap-2 w-max rounded-md p-2 cursor-pointer font-semibold border-1 text-gray-700/80 border-gray-700/20 shadow-md`}>{icon}{text}</button>
      </div>
    </>
  )
}
export default ButtonDownload