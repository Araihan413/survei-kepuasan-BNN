import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';

const PopupDetail = ({ dataPopup, open, handleClose, layoutForm, handleToPopupEdit }) => {
  const handleToEdit = () => {
    handleToPopupEdit();
  };
  return (
    <>
      <div>
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", marginBottom: "0px", paddingBottom: "0px" }}>Data Detail</DialogTitle>

          {dataPopup ? (
            <form onSubmit={(e) => e.preventDefault()}>
              <DialogContent>
                {layoutForm.map((item, index) => {
                  return (
                    <div key={index} className='flex flex-col gap-1 mb-3'>
                      <label htmlFor={item.label} className='font-semibold'>{item.label}</label>
                      {item.type === "textArea" ? (
                        <textarea type={item.type}
                          name={item.key}
                          id={item.label}
                          readOnly={true}
                          value={dataPopup[item.key] ?? ''}
                          className='py-2 px-3 bg-slate-100 outline-0 rounded-md text-sm border-1 border-gray-300 text-gray-500 resize-none' />
                      ) : (
                        <input type={item.type}
                          name={item.key}
                          id={item.label}
                          readOnly={true}
                          value={dataPopup[item.key] ?? ''}
                          className='py-2 px-3 bg-slate-100 outline-0 rounded-md text-sm border-1 border-gray-300 text-gray-500 ' />
                      )}
                    </div>
                  )
                })}
              </DialogContent>
              <DialogActions sx={{ paddingTop: "0px", marginBottom: "0px" }}>
                <Button sx={{ backgroundColor: "#0575E6", color: "white" }} onClick={handleToEdit} >Edit</Button>
                <Button sx={{ marginRight: "20px" }} onClick={handleClose}>Tutup</Button>
              </DialogActions>
            </form>
          ) : (<p className='text-center text-red-400 py-10'>Data Tidak Ditemukan</p>)}
          <DialogActions>
          </DialogActions>
        </Dialog>
      </div>
    </>
  )
}

export default PopupDetail

// export const PopupDetailQuestion = ({ dataPopup, open, handleClose, layoutForm, handleToPopupEdit }) => {
//   const handleToEdit = () => {
//     handleToPopupEdit();
//   };
//   return (
//     <>
//       <div>
//         <Dialog open={open} onClose={handleClose} fullWidth>
//           <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", marginBottom: "0px", paddingBottom: "0px" }}>Detail Survey</DialogTitle>

//           {dataPopup ? (
//             <form onSubmit={(e) => e.preventDefault()}>
//               <DialogContent>
//                 {layoutForm.map((item, index) => {
//                   return (
//                     item.type === "opsi" ? (
//                       <div key={index} className='flex flex-col gap-1 mb-3'>
//                         <label htmlFor={item.label} className='font-semibold'>{item.label}</label>
//                         <input type={item.type}
//                           name={item.key}
//                           id={item.label}
//                           readOnly={true}
//                           value={dataPopup[item.key] ?? ''}
//                           className='py-2 px-3 bg-slate-100 outline-0 rounded-md text-sm border-1 border-gray-300 text-gray-500' />
//                         <div>
//                           {dataPopup.option.map((option, index) => (
//                             <div key={index}>
//                               <input type="radio" name="option" value={option.optionId} readOnly />
//                               <label>{option.optionText}</label>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     ) :
//                       <div key={index} className='flex flex-col gap-1 mb-3'>
//                         <label htmlFor={item.label} className='font-semibold'>{item.label}</label>
//                         <input type={item.type}
//                           name={item.key}
//                           id={item.label}
//                           readOnly={true}
//                           value={dataPopup[item.key] ?? ''}
//                           className='py-2 px-3 bg-slate-100 outline-0 rounded-md text-sm border-1 border-gray-300 text-gray-500' />
//                       </div>
//                   )
//                 })}
//               </DialogContent>
//               <DialogActions sx={{ paddingTop: "0px", marginBottom: "0px" }}>
//                 <Button sx={{ backgroundColor: "#0575E6", color: "white" }} onClick={handleToEdit} >Edit</Button>
//                 <Button sx={{ marginRight: "20px" }} onClick={handleClose}>Tutup</Button>
//               </DialogActions>
//             </form>
//           ) : (<p className='text-center text-red-400 py-10'>Data Tidak Ditemukan</p>)}
//           <DialogActions>
//           </DialogActions>
//         </Dialog>
//       </div>
//     </>
//   )
// }
// PopupDetail