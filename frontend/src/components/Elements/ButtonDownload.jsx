const ButtonDownload = ({ type = 'button', text = '', onClick = '', color = 'bg-slate-200', icon = '', style = '' }) => {
  return (
    <>
      <div className="w-max">
        <button onClick={onClick} type={type} className={`${color} ${style} flex justify-center items-center gap-2 w-max rounded-md p-2 cursor-pointer font-bold border-1 border-black/20`}>{icon}{text}</button>
      </div>
    </>
  )
}
export default ButtonDownload