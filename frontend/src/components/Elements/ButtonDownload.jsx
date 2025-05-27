const ButtonDownload = ({ type, text = '', onClick = '', color = 'bg-slate-200', icon = '', style = '' }) => {
  return (
    <>
      <div>
        <button onClick={onClick} type={type} className={`${color} ${style} w-max p-2 font-semibold cursor-pointer`}>{icon}{text}</button>
      </div>
    </>
  )
}
export default ButtonDownload