import { Link } from "react-router-dom"

const ForgetPassword = () => {
  return (
    <>
      <div className="min-w-screen min-h-screen flex justify-center items-center bg-gradasi-biru">
        <div className="bg-white w-[500px] py-15 px-15 rounded-4xl shadow-md">
          <div className="text-center pb-8 px-5 flex flex-col items-center ">
            <h1 className="text-3xl text-biru-muda font-bold mb-4">Lupa Password ?</h1>
            <p className="text-sm w-11/12">Masukkan Email Anda dan Kami Akan Mengirimkan Link Untuk Mengganti Password</p>
          </div>
          <div>
            <form action="">
              <div className="rounded-full overflow-hidden flex">
                <input type="email" id="email" placeholder="Email" className="bg-slate-200 py-2.5 px-6 outline-0 w-full text-sm" />
                <button type="submit" className="bg-biru-muda text-white  py-2.5 px-8 cursor-pointer font-semibold">Kirim</button>
              </div>
            </form>
            <div className="mt-5 text-center">
              <Link to={"/login"} className="text-sm text-biru-muda/70 font-semibold">Kembali ke Login ?</Link>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
export default ForgetPassword