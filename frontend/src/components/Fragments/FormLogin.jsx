import FormField from "../Elements/FormField"
import { IoIosLock } from "react-icons/io";
import { MdOutlineEmail } from "react-icons/md";
import Button from "../Elements/Button";

const FormLogin = () => {
  return (
    <>
      <div className="flex max-w-130 w-full h-screen flex-col justify-center gap-5 p-20">
        <div>
          <h1 className="text-2xl font-bold">Selamat Datang</h1>
          <p className="text-sm">Di Aplikasi Dashborad Survei BNN Kab.Sleman</p>
        </div>
        <form className="flex flex-col gap-4" action="">
          <FormField name="username" placeholder='Username' icon={MdOutlineEmail} ></FormField>
          <FormField name="password" placeholder="Password" type="password" icon={IoIosLock}></FormField>
          <Button type="submit" text="Login" color="bg-[#0082cd]" style="text-white mt-2"></Button>
        </form>
        <div className="flex justify-center">
          <p className="text-sm text-blue-500/60 cursor-pointer">Lupa Password?</p>
        </div>
      </div>
    </>
  )
}
export default FormLogin