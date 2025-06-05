import Button from "../Elements/Button"

const Profile = () => {
  return (
    <>
      <section className="p-5 flex justify-center w-full">
        <div className="bg-white w-[900px] rounded-xl overflow-hidden">
          <div className="h-20 bg-biru-tua w-full">
          </div>
          <div className="flex justify-between items-center p-5">
            <div className="flex items-center gap-3" >
              <div className="w-14 h-14 rounded-xl cursor-pointer">
                <img src="../aset/profile/profileDefault.png" alt="gambar profile" />
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="font-semibold text-xl">Ahmad Raihan</h1>
                <p className="text-xs">arraihan0104@gmail.com</p>
              </div>
            </div>
            <div>
              <Button text="Edit Profile" type="button" color="bg-biru-muda" style="text-white"></Button>
            </div>
          </div>

          <div>
            <form action="" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-8 p-5">
                <div className="flex flex-col gap-2 col-span-1">
                  <label htmlFor="nama" className="font-semibold">Nama :</label>
                  <input type="text" disabled id="nama" className="bg-slate-100 py-2 px-3 outline-0 rounded-md text-sm" value={"Ahmad Raihan"} />
                </div>
                <div className="flex flex-col gap-2 col-span-1">
                  <label htmlFor="username" className="font-semibold">Username :</label>
                  <input type="text" disabled id="username" className="bg-slate-100 py-2 px-3 outline-0 rounded-md text-sm" value={"Raihan"} />
                </div>
                <div className="flex flex-col gap-2 col-span-1">
                  <label htmlFor="jenis_kelamin" className="font-semibold">Jenis Kelamin :</label>
                  <input type="text" disabled id="jenis_kelamin" className="bg-slate-100 py-2 px-3 outline-0 rounded-md text-sm" value={"Laki-laki"} />
                </div>
                <div className="flex flex-col gap-2 col-span-1">
                  <label htmlFor="id_admin" className="font-semibold">ID Admin :</label>
                  <input type="text" disabled id="id_admin" className="bg-slate-100 py-2 px-3 outline-0 rounded-md text-sm" value={"123234"} />
                </div>
              </div>

            </form>
          </div>

          <div className="p-5 mt-10">
            <button teype="button" className="font-semibold text-red-400 cursor-pointer">Ganti Password</button>
          </div>
        </div>
      </section>
    </>
  )
}
export default Profile