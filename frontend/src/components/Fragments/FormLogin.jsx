import FormField from "../Elements/FormField"

const FormLogin = () => {
  return (
    <>
      <div className="flex flex-col gap-5 bg-slate-100 p-20 rounded-lg">
        <FormField name="username" label="Username" placeholder='Masukkan username'></FormField>
        <FormField name="password" label="Password" type="password" placeholder="Masukkan password"></FormField>
      </div>
    </>
  )
}
export default FormLogin