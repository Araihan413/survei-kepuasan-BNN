import { useForm } from 'react-hook-form';
import Button from '../Elements/Button';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useEffect } from 'react';

const FormQuestionSurvey = ({ dataListQuestion, dataListService, onSubmit, onNextPage, onPrevPage, pageActive, dataForm, loadingSubmit }) => {
  const formKey = `survey-answers`;
  const savedAnswers = JSON.parse(localStorage.getItem(formKey)) || {};
  const {
    register,
    trigger,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: savedAnswers, // atau "onSubmit"
  });

  const answers = watch();

  // Simpan jawaban ke localStorage saat ada perubahan
  useEffect(() => {
    localStorage.setItem(formKey, JSON.stringify(answers));
  }, [answers]);

  const nextPage = async () => {
    const isValid = await trigger();
    if (isValid) {
      onNextPage(); // kirim sinyal ke Parent untuk ubah halaman
    }
  }

  const handleSubmitForm = async () => {
    const isValid = await trigger();
    if (isValid) {
      const answers = watch()
      onSubmit(answers);
      reset({});
    }
  };
  return (
    <>
      <div className="px-5">
        <form className="flex flex-col gap-5 w-full md:w-120" onSubmit={(e) => e.preventDefault()}>
          {dataListQuestion.map((item, index) => {
            return (
              <div key={item.questionId} className="flex flex-col gap-5 bg-white p-5 pb-8 text-sm rounded-md relative">

                {/* pertanyaan text */}
                <div className="relative w-max max-w-80 md:max-w-110">
                  {item.isRequired && <span className="text-red-500 absolute top-0 -right-2">*</span>}
                  {pageActive === 1 ? <label className="block break-words whitespace-normal">
                    {item.questionText}
                  </label> :
                    <label className="block break-words whitespace-normal">
                      {index + 1}. {item.questionText}
                    </label>}
                </div>

                {/* pilihan atau jawaban */}
                {item.questionType === "text" && (
                  <input
                    type={item.respondentField === "age" || item.respondentField === "phoneNumber" ? "number" : "text"}
                    placeholder="Jawaban Anda"
                    className="outline-none border-b-1 border-gray-300 pt-2 pb-1 text-sm"
                    {...register(
                      item.isPersonal ? item.respondentField : `question-${item.questionId}`,
                      {
                        required: item.isRequired ? "Jawaban tidak boleh kosong" : false,
                        ...(item.respondentField === "age"
                          ? {
                            valueAsNumber: true,
                            validate: {
                              isNumber: (value) => !isNaN(value) || "Harus berupa angka",
                              min: (value) => value > 0 || "Umur harus lebih dari 0",
                              max: (value) => value <= 120 || "Umur tidak masuk akal (maks 120)",
                            },
                          }
                          : item.respondentField === "phoneNumber"
                            ? {
                              valueAsNumber: true,
                              validate: (value) => !isNaN(value) || "Harus berupa angka",
                            }
                            : {})
                      }
                    )}
                  />
                )}

                {item.questionType === "skala" && item.option && (
                  <div className="flex flex-col gap-2">
                    {item.option.map((opt, i) => (
                      <label key={opt.optionId} className="flex items-center gap-3 break-all">
                        <input
                          type="radio"
                          name={item.isPersonal ? `${item.respondentField}` : `question-${item.questionId}`}
                          value={opt.optionId}
                          className="mt-1.5 cursor-pointer"
                          {...register(item.isPersonal ? `${item.respondentField}` : `question-${item.questionId}`, {
                            required: item.isRequired ? 'Jawaban tidak boleh kosong' : false,
                          })}
                        />
                        {opt.optionText}
                      </label>
                    ))}
                  </div>
                )}

                {item.questionType === "opsi" && item.option && (
                  <div className="flex flex-col gap-2">
                    {item.respondentField === "serviceId"
                      ? dataListService.map((opt, i) => (
                        <label key={opt.serviceId} className="flex items-center gap-3 break-all">
                          <input
                            type="radio"
                            name={item.isPersonal ? `${item.respondentField}` : `question-${item.questionId}`}
                            value={opt.serviceId}
                            className="mt-1 cursor-pointer"
                            {...register(item.isPersonal ? `${item.respondentField}` : `question-${item.questionId}`, {
                              required: item.isRequired ? 'Jawaban tidak boleh kosong' : false,
                            })}
                          />
                          {opt.name}
                        </label>
                      ))

                      : item.option.map((opt, i) => (
                        <label key={opt.optionId} className="flex items-center gap-3 break-all">
                          <input
                            type="radio"
                            name={item.isPersonal ? `${item.respondentField}` : `question-${item.questionId}`}
                            value={item.isPersonal ? opt.optionText : opt.optionId}
                            className="mt-1 cursor-pointer"
                            {...register(item.isPersonal ? `${item.respondentField}` : `question-${item.questionId}`, {
                              required: item.isRequired ? 'Jawaban tidak boleh kosong' : false,
                            })}
                          />
                          {opt.optionText}
                        </label>
                      ))}
                  </div>
                )}
                {errors[item.isPersonal ? `${item.respondentField}` : `question-${item.questionId}`] && <span className="flex gap-2 absolute bottom-2 left-4 text-red-400/70 text-xs "><IoMdInformationCircleOutline className=' text-lg' />{errors[item.isPersonal ? `${item.respondentField}` : `question-${item.questionId}`].message}</span>}
              </div>
            );
          })}

          <div className="w-full flex justify-center items-center">
            <div className="flex justify-start max-w-120 gap-4 w-full">
              {pageActive > 1 ? <Button type="button" text="Kembali" color="bg-white" style="text-sky-400 rounded-md" onClick={onPrevPage}></Button> : ''}

              {dataForm.length === pageActive ? <Button type="button" text={loadingSubmit ? "Loading..." : "Kirim"} disabled={loadingSubmit} color="bg-sky-400" style="text-white rounded-md" onClick={handleSubmitForm}></Button> : <Button type="button" text="Berikutnya" color="bg-white" style="text-sky-400 rounded-md" onClick={nextPage}></Button>}
            </div>
          </div>

        </form>
      </div>


    </>
  )
}
export default FormQuestionSurvey