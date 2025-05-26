import FormLogin from "../Fragments/FormLogin"

const Login = () => {
  return (
    <>
      <div className="w-full flex flex-row bg-[#0082cd]">
        <div className="w-6/10 flex flex-col justify-center items-center">
          <div>
            <h1 className="text-5xl font-bold text-white">SIGAP BNN</h1>
            <p className="text-white">Sistem Informasi dan Penilaian Guna Peningkatan BNN</p>
          </div>
        </div>
        <div className="w-4/10 flex justify-center bg-white">
          <FormLogin></FormLogin>
        </div>
      </div>
    </>
  )
}
export default Login