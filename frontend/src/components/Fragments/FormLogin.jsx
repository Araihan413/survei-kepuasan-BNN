import FormField from "../Elements/FormField"
import { IoIosLock } from "react-icons/io";
import { MdOutlineEmail } from "react-icons/md";
import Button from "../Elements/Button";
import { useForm } from 'react-hook-form';
import { Link } from "react-router-dom";
import { IoMdInformationCircleOutline } from "react-icons/io";
const FormLogin = ({ onSubmit, errorMessage }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    formState: { isSubmitting }
  } = useForm();
  return (
    <>
      <div className="flex max-w-130 w-full h-screen flex-col justify-center gap-5 p-20">
        <div>
          <h1 className="text-2xl font-bold">Selamat Datang</h1>
          <p className="text-sm">Di Aplikasi Dashborad Survei BNN Kab.Sleman</p>
        </div>
        <form className="flex flex-col gap-7 relative" action="post" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col relative">
            <MdOutlineEmail className="absolute opacity-90 left-3 top-1/2 -translate-y-1/2 text-[#5d5d5d] text-xl" />
            <input
              className="pl-10 border-1 pr-3 py-4 text-sm outline-none shadow-md rounded-2xl border-gray-300/50"
              placeholder="Username"
              type="username"
              {...register('username', {
                required: 'Username wajib diisi',
                minLength: {
                  value: 3,
                  message: 'username minimal 3 karakter'
                }
              })}
            />
            {errors.username &&
              <div className='absolute -bottom-5 left-1 flex gap-1 text-red-400/70'>
                <IoMdInformationCircleOutline />
                <span className=" text-xs ">{errors.username.message}</span>
              </div>}
          </div>

          <div className="flex flex-col relative ">
            <IoIosLock className="absolute opacity-90 left-3 top-1/2 -translate-y-1/2 text-[#5d5d5d] text-xl" />
            <input
              className="pl-10 border-1 pr-3 py-4 text-sm outline-none shadow-md rounded-2xl border-gray-300/50"
              placeholder="Password"
              type="password"
              {...register('password', {
                required: 'Password wajib diisi',
                validate: (value) => value.includes(' ') ? 'Password tidak boleh mengandung spasi' : true,
                minLength: {
                  value: 6,
                  message: 'Password minimal 6 karakter'
                }
              })}
            />
            {errors.password &&
              <div className='absolute -bottom-5 left-1 flex gap-1 text-red-400/70'>
                <IoMdInformationCircleOutline />
                <span className=" text-xs ">{errors.password.message}</span>
              </div>}
          </div>
          {errorMessage &&
            <div className="text-sm text-red-400/70 absolute w-full bottom-11">
              <p className="text-center">{errorMessage}</p>
            </div>
          }
          <Button type="submit" text={isSubmitting ? 'Loading...' : 'Login'} color="bg-[#0082cd]" style="text-white mt-6" disabled={isSubmitting}></Button>
        </form>
        <div className="flex justify-center">
          <Link to="/lupa-password" className="text-sm text-biru-muda/70 cursor-pointer font-semibold">Lupa Password ?</Link>
        </div>
      </div>
    </>
  )
}
export default FormLogin

