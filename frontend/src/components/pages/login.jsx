import FormLogin from "../Fragments/FormLogin"
import { useEffect, useState } from "react"
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import urlApi from "../../api/urlApi";

const Login = () => {
  const navigate = useNavigate();
  const { reset } = useForm();
  const [errorMessage, setErrorMessage] = useState('')

  const onSubmitLogin = (data) => {
    setErrorMessage('')
    const fetchData = async () => {
      try {
        const response = await fetch(`${urlApi}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: data.username,
            password: data.password
          })
        })

        const dataAdmin = await response.json()
        if (!response.ok) {
          throw new Error(dataAdmin.message || dataAdmin.error || 'Login Gagal!');
        }
        localStorage.setItem('accessToken', dataAdmin.data.accessToken);
        localStorage.setItem('admin', JSON.stringify(dataAdmin.data.admin));

        navigate('/dashboard')
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        reset()
      }
    }
    fetchData()
  }
  return (
    <>
      <div className="w-full flex flex-row bg-gradasi-biru relative overflow-hidden">

        <span className="inline-block w-60 h-60 absolute -bottom-30 -left-5 border-2 border-white/80 rounded-full bg-slate-50/5"></span>
        <span className="inline-block w-60 h-60 absolute -bottom-25 -left-15 border-2 border-white/80 rounded-full bg-slate-50/5"></span>

        <div className="w-6/10 flex justify-center items-center gap-4">
          <div className="w-25">
            <img className="w-full" src="/aset/logo/logoBnn.png" alt="Logo BNN" />
          </div>
          <div>
            <h1 className="text-5xl font-bold text-white">SIGAP BNN</h1>
            <p className="text-white">Sistem Informasi dan Penilaian Guna Peningkatan BNN</p>
          </div>
        </div>
        <div className="w-4/10 flex justify-center bg-white">
          <FormLogin onSubmit={onSubmitLogin} errorMessage={errorMessage}></FormLogin>
        </div>
      </div>
    </>
  )
}

export default Login