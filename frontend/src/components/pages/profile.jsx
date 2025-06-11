import Button from "../Elements/Button"
import urlApi from "../../api/urlApi"
import { useState, useEffect, useContext, useRef } from "react"
import { AuthContext } from "../../AuthContext"
import { AlertFailed, AlertSuccess } from "../Elements/Alert"
import { useForm } from "react-hook-form"
import { IoIosInformationCircle } from "react-icons/io";
import { TbEyeClosed } from "react-icons/tb";
import { FaEye, FaCamera } from "react-icons/fa";

const Profile = () => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const [dataAdmin, setDataAdmin] = useState({})
  const [editProfil, setEditProfil] = useState(false)
  const { admin, updateAdmin } = useContext(AuthContext)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [image, setImage] = useState(null);
  const targetScrollRef = useRef(null);
  const inputImageRef = useRef(null);

  const handleUploadImage = () => {
    inputImageRef.current.click(); // Klik otomatis input file
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // Set preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScroll = () => {
    targetScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!admin || !admin.id) {
      return
    }
    const fetchData = async (id) => {
      try {
        const response = await fetch(`${urlApi}/admin/${id}`)
        const admin = await response.json()
        setDataAdmin(admin.data)
        reset(admin.data);
      } catch (error) {
        AlertFailed({ text: error.message })
      }
    }
    fetchData(admin.id)
  }, [admin, reset])

  const handleEditProfil = () => {
    console.log("edit")
    setEditProfil(true)
  }

  const handleCancelEditProfil = () => {
    reset(dataAdmin)
    setEditProfil(false)
  }

  const handleSubmitEditProfil = async (data) => {
    if (!data.name || !data.username || !data.email) return
    const dataEdit = {
      name: data.name,
      username: data.username,
      email: data.email
    }
    try {
      const response = await fetch(`${urlApi}/admin/${data.adminId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataEdit)
      })
      const admin = await response.json()
      if (!response.ok) throw new Error(admin.message || admin.error)
      if (response.ok) {

        setDataAdmin(admin.data)
        updateAdmin({ id: admin.data.adminId, role: admin.data.role, name: admin.data.name, email: admin.data.email });
        setEditProfil(false)
        AlertSuccess({ text: 'Data berhasil diedit!' })
      }
    } catch (error) {
      AlertFailed({ text: error.message })
    }
  }

  const dataShow = [
    { key: "name", label: "Nama", type: "text", editAccess: true, validation: { required: 'Nama wajib diisi' } },
    {
      key: "username", label: "username", type: "text", editAccess: true, validation: {
        required: 'Username wajib diisi',
        validate: value =>
          value.replace(/[^a-zA-Z]/g, "").length > 3 || "Username harus lebih dari 3 huruf"
      }
    },
    { key: "adminId", label: "ID Admin", type: "text", editAccess: false, validation: { required: 'ID Admin wajib diisi' } },
    {
      key: "email", label: "email", type: "email", editAccess: true,
      validation: {
        required: 'Email wajib diisi', pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Format email tidak valid"
        }
      }
    },
  ]

  const newPassword = watch("newPassword");
  const formChangePassword = [
    { key: "oldPassword", label: "Password Lama", type: "password", editAccess: true, validation: { required: 'Password lama wajib diisi' } },
    {
      key: "newPassword", label: "Password Baru", type: "password", editAccess: true,
      validation: {
        required: 'Password baru wajib diisi',
        validate: {
          hasUpperCase: value => /[A-Z]/.test(value) || "Harus mengandung huruf besar",
          hasLowerCase: value => /[a-z]/.test(value) || "Harus mengandung huruf kecil",
          hasNumber: value => /[0-9]/.test(value) || "Harus mengandung angka",
          hasSpecialChar: value => /[^A-Za-z0-9]/.test(value) || "Harus mengandung karakter spesial",
          noSpaces: value => !/\s/.test(value) || "Password tidak boleh mengandung spasi",
          minLength: value => value.length >= 8 || "Minimal 8 karakter",
        }
      }
    },
    {
      key: "confirmPassword", label: "Konfirmasi Password", type: "password", editAccess: true, validation: {
        required: 'Konfirmasi password wajib diisi', validate: (value) =>
          value === newPassword || "Password tidak cocok",
      }
    },
  ]

  const handleChangePassword = () => {
    setShowChangePassword(true)
    handleScroll();
  }

  useEffect(() => {
    if (showChangePassword && targetScrollRef.current) {
      targetScrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showChangePassword]);

  const handleCancelChangePassword = () => {
    setShowChangePassword(false)
  }

  const handleSubmitChangePassword = async (data) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`${urlApi}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword
        }),
      });
      const res = await response.json();
      if (!response.ok) throw new Error(res.message || res.error);
      AlertSuccess({ text: "Password berhasil diganti" });
      reset();
      setShowChangePassword(false);
    } catch (error) {
      console.log(error);
      AlertFailed({ text: error.message });
    }
  };

  const handleShowPassword = (key) => {
    setShowPassword((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }
  return (
    <>
      <section className="p-5 flex justify-center w-full">
        <div className="bg-white w-[900px] rounded-xl overflow-hidden">
          <div className="h-20 bg-biru-tua w-full">
          </div>
          {dataAdmin ? (
            <>
              <div className="flex justify-between items-center p-5">
                <div className="flex items-center gap-5" >
                  <div className="w-20 h-20   relative ">
                    <img src={image ? image : "../aset/profile/profileDefault.png"} alt="gambar profile" className="w-full h-full rounded-3xl overflow-hidden" />
                    <div>
                      <button onClick={handleUploadImage} className="cursor-pointer absolute -bottom-2 -right-2 w-8 h-8 bg-white/20 backdrop-blur rounded-full flex justify-center items-center p-1 shadow-md">
                        <FaCamera className="text-gray-600" />
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={inputImageRef}
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h1 className="font-semibold text-xl">{dataAdmin.name}</h1>
                    <p className="text-xs">{dataAdmin.email}</p>
                  </div>
                </div>
                <div>
                  <Button text="Edit Profile" type="button" color="bg-biru-muda" style="text-white" onClick={handleEditProfil}></Button>
                </div>
              </div>
              <div>
                <form onSubmit={handleSubmit(handleSubmitEditProfil)} className="relative">
                  <div className="grid grid-cols-2 gap-8 p-5">
                    {dataShow.map((item, index) => (
                      <div key={index} className="flex flex-col gap-2 col-span-1 relative">
                        <label htmlFor={item.key} className="font-semibold">{item.label} :</label>
                        <input type={item.type}
                          disabled={!(editProfil && item.editAccess)}
                          id={item.key}
                          className={`bg-slate-100 py-2 px-3 outline-0 rounded-md text-sm ${editProfil && item.editAccess ? 'text-black' : 'text-gray-500'} `}
                          {...register(item.key, item.validation)}
                        />

                        {errors[item.key] &&
                          <p className="text-xs text-red-400 absolute -bottom-5">{errors[item.key]?.message}
                          </p>}
                      </div>
                    ))}
                  </div>
                  {editProfil &&
                    <div className="flex justify-end gap-3 p-5 absolute -bottom-18 right-0">
                      <Button text="Simpan" type="submit" color="bg-biru-muda" style="text-white"></Button>
                      <Button text="Batal" type="button" color="bg-red-400" style="text-white" onClick={handleCancelEditProfil}></Button>
                    </div>
                  }
                </form>
              </div>
              <div className="p-5 mt-15 flex items-center flex-col gap-5">
                {!showChangePassword &&
                  <div>
                    <button onClick={handleChangePassword} type="button" className="font-semibold text-red-400 cursor-pointer">Ganti Password</button>
                  </div>
                }
                {showChangePassword &&
                  <div className="w-[500px] bg-white rounded-2xl shadow-lg p-5">

                    <h1 className="text-2xl font-semibold text-center mb-5">Ganti Password Anda</h1>
                    <form ref={targetScrollRef} onSubmit={handleSubmit(handleSubmitChangePassword)}>
                      <div className="flex flex-col gap-5">
                        {formChangePassword.map((item, index) => (
                          <div key={index} className="flex flex-col gap-2 relative">
                            <label htmlFor={item.key} className="font-semibold">{item.label} :</label>
                            <div className="flex w-full items-center relative">
                              <input
                                type={showPassword[item.key] ? "text" : item.type}
                                id={item.key}
                                className="bg-slate-100 py-2 px-3 outline-0 rounded-md text-sm w-full pr-12 shadow-md"
                                {...register(item.key, item.validation)}
                              />
                              <div onClick={() => handleShowPassword(item.key)} className="absolute right-3 cursor-pointer p-1">
                                {showPassword[item.key] ? <FaEye /> : <TbEyeClosed />}
                              </div>
                            </div>
                            {errors[item.key] &&
                              <p className="text-xs text-red-400 absolute -bottom-5">{errors[item.key]?.message}
                              </p>}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2">
                        <div className="flex flex-col gap-1 mt-6 col-span-1">
                          <div className="flex items-start -mb-0.5 gap-1">
                            <IoIosInformationCircle className="text-biru-muda text-sm" />
                            <p className="text-xs text-biru-muda">Minimal 8 karakter</p>
                          </div>
                          <div className="flex items-start -mb-0.5 gap-1">
                            <IoIosInformationCircle className="text-biru-muda text-sm" />
                            <p className="text-xs text-biru-muda">Harus mengandung huruf besar</p>
                          </div>
                          <div className="flex items-start -mb-0.5 gap-1">
                            <IoIosInformationCircle className="text-biru-muda text-sm" />
                            <p className="text-xs text-biru-muda">Harus mengandung huruf kecil</p>
                          </div>
                          <div className="flex items-start -mb-0.5 gap-1">
                            <IoIosInformationCircle className="text-biru-muda text-sm" />
                            <p className="text-xs text-biru-muda">Harus mengandung angka</p>
                          </div>
                          <div className="flex items-start -mb-0.5 gap-1">
                            <IoIosInformationCircle className="text-biru-muda text-sm" />
                            <p className="text-xs text-biru-muda">Harus mengandung karakter spesial</p>
                          </div>
                          <div className="flex items-start -mb-0.5 gap-1">
                            <IoIosInformationCircle className="text-biru-muda text-sm" />
                            <p className="text-xs text-biru-muda">Password tidak boleh mengandung spasi</p>
                          </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6 col-span-1 place-self-end">
                          <Button text="Simpan" type="submit" color="bg-biru-muda" style="text-white"></Button>
                          <Button text="Batal" type="button" color="bg-red-400" style="text-white" onClick={handleCancelChangePassword}></Button>
                        </div>
                      </div>
                    </form>
                  </div>
                }
              </div>
            </>)
            : (
              <div className="w-full h-40 text-biru-muda flex justify-center items-center ">Memuat Data...</div>
            )}
        </div>
      </section>
    </>
  )
}
export default Profile