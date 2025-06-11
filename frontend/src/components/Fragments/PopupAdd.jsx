import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useState, useContext } from 'react';
import urlApi from "../../api/urlApi"
import { useForm } from 'react-hook-form';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { AlertFailed, AlertSuccess } from '../Elements/Alert';
import { IoClose } from "react-icons/io5";
import { FaTrashCan } from "react-icons/fa6";
import { AuthContext } from '../../AuthContext';
const PopupCreateSurvey = ({ open, handleCancel, lengthSurvey, onSuccessAdd }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    formState: { isSubmitting },
    reset
  } = useForm();
  const formSurvey = [
    { key: "title", label: "Judul survei", type: "text", isRequired: true, validation: { required: 'Judul survei wajib diisi' } },
    { key: "description", label: "Deskripsi survei", type: "textArea", isRequired: false, validation: {} },
  ]

  const handleCreateSurvey = (data) => {
    const dataAdmin = localStorage.getItem('admin');
    const adminId = JSON.parse(dataAdmin).adminId;
    if (!data.title) return
    const dataSurvey = {
      title: data.title,
      description: data.description,
      adminId: adminId,
      orderPage: lengthSurvey + 1,
    }
    const fetchData = async () => {
      // ! harus ada adminId, OrderPage
      try {
        const response = await fetch(`${urlApi}/survey`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataSurvey),
        });
        if (!response.ok) throw new Error(response.error);
        const data = await response.json();
        onSuccessAdd?.(data.data);
        AlertSuccess({ text: 'Survei berhasil ditambahkan!' });
        handleCancel();
      } catch (error) {
        AlertFailed({ text: error.message });
      }
    };
    fetchData();
  }

  const handleCancelAddSurvey = () => {
    reset();
    handleCancel();
  }

  return (<>
    <div>
      <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="xs">
        <DialogTitle>Masukkan Data Survei</DialogTitle>
        <form onSubmit={handleSubmit(handleCreateSurvey)}>
          <DialogContent>
            {formSurvey.map((item, index) => {
              return (
                <div key={index} className='flex flex-col gap-1 mb-6 relative'>
                  <div className='relative w-max'>
                    {item.isRequired &&
                      <span className="text-red-500 absolute top-0 -right-2">*</span>
                    }
                    <label htmlFor={item.key} className='font-semibold'>{item.label}</label>
                  </div>
                  {item.type === "textArea" ? (
                    <textarea
                      name={item.key}
                      id={item.key}
                      className='py-2 px-3 bg-slate-100 outline-0 rounded-md text-sm border-1 border-gray-300 text-gray-500'
                      {...register(item.key, item.validation)}
                    />
                  ) : (
                    <input type={item.type}
                      {...register(item.key, item.validation)}
                      name={item.key}
                      id={item.key}
                      className='py-2 px-3 bg-slate-100 outline-0 rounded-md text-sm border-1 border-gray-300 text-gray-500'
                    />
                  )}
                  {errors[item.key] &&
                    <div className='absolute -bottom-5 left-1 flex gap-1 text-red-400/70'>
                      <IoMdInformationCircleOutline />
                      <span className=" text-xs ">{errors[item.key].message}</span>
                    </div>}
                </div>
              )
            })}
          </DialogContent>
          <DialogActions>
            <Button sx={{ marginRight: "20px" }} onClick={handleCancelAddSurvey}>Batal</Button>
            <Button sx={{ backgroundColor: "#0575E6", color: "white", marginRight: "12px" }} type="submit" >{isSubmitting ? 'Loading...' : 'Simpan'}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  </>)
}

const PopupCreateService = ({ open, handleCancel, onSuccessAdd }) => {
  const formService = [
    { key: "name", label: "Nama pelayanan", type: "text", isRequired: true, validation: { required: 'Nama pelayana wajib diisi' } },
    { key: "label", label: "Label pelayanan", type: "text", isRequired: true, validation: { required: 'Label pelayana wajib diisi' } },
    { key: "description", label: "Deskripsi pelayanan", type: "textArea", isRequired: false, validation: {} },
  ]

  const {
    register,
    handleSubmit,
    formState: { errors },
    formState: { isSubmitting },
    reset
  } = useForm();
  const [error, setError] = useState(null);

  const handleCreateSurvey = (data) => {
    const dataSurvey = {
      name: data.name,
      label: data.label,
      description: data.description,
    }
    const fetchData = async () => {
      // ! harus ada adminId, OrderPage
      try {
        const response = await fetch(`${urlApi}/service`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataSurvey),
        });
        if (!response.ok) throw new Error(response.message || response.error);
        const data = await response.json();
        onSuccessAdd?.(data.data);
        AlertSuccess({ text: 'Survei berhasil ditambahkan!' });
        reset();
        handleCancel();
      } catch (error) {
        AlertFailed({ text: error.message });
      }
    };
    fetchData();
  }

  return (<>
    <div>
      <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="xs">
        <DialogTitle>Masukkan Data Survei</DialogTitle>
        <form onSubmit={handleSubmit(handleCreateSurvey)}>
          <DialogContent>
            {formService.map((item, index) => {
              return (
                <div key={index} className='flex flex-col gap-1 mb-6 relative'>
                  <div className='relative w-max'>
                    {item.isRequired &&
                      <span className="text-red-500 absolute top-0 -right-2">*</span>
                    }
                    <label htmlFor={item.key} className='font-semibold'>{item.label}</label>
                  </div>
                  {item.type === "textArea" ? (
                    <textarea
                      name={item.key}
                      id={item.key}
                      className='py-2 px-3 bg-slate-100 outline-0 rounded-md text-sm border-1 border-gray-300 text-gray-500'
                      {...register(item.key, item.validation)}
                    />
                  ) : (
                    <input type={item.type}
                      {...register(item.key, item.validation)}
                      name={item.key}
                      id={item.key}
                      className='py-2 px-3 bg-slate-100 outline-0 rounded-md text-sm border-1 border-gray-300 text-gray-500'
                    />
                  )}
                  {errors[item.key] &&
                    <div className='absolute -bottom-5 left-1 flex gap-1 text-red-400/70'>
                      <IoMdInformationCircleOutline />
                      <span className=" text-xs ">{errors[item.key].message}</span>
                    </div>}
                </div>
              )
            })}
          </DialogContent>
          <DialogActions>
            <Button sx={{ marginRight: "20px" }} onClick={handleCancel}>Batal</Button>
            <Button sx={{ backgroundColor: "#0575E6", color: "white", marginRight: "12px" }} type="submit" >{isSubmitting ? 'Loading...' : 'Simpan'}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  </>)
}

const PopupCreateQuestion = ({ surveyId, lengthQuestion, handleClose, onSuccessSumbit }) => {
  const [questions, setQuestions] = useState([]);
  const { admin } = useContext(AuthContext);


  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        type: "text",
        required: false,
        options: [""], // Untuk tipe 'opsi'
        scaleOptions: null, // Untuk tipe 'skala'
        scaleValues: null // Untuk nilai skala
      },
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;

    // Reset opsi ketika mengubah tipe pertanyaan
    if (field === "type") {
      if (value === "skala") {
        // Set opsi default untuk skala
        updated[index].scaleOptions = ["Sangat Setuju", "Setuju", "Tidak Setuju", "Sangat Tidak Setuju"];
        updated[index].scaleValues = [4, 3, 2, 1];
        updated[index].options = [""]; // Reset opsi biasa
      } else if (value === "opsi") {
        // Set opsi default untuk pilihan biasa
        updated[index].options = [""];
        updated[index].scaleOptions = null;
        updated[index].scaleValues = null;
      } else {
        // Reset semua untuk tipe text
        updated[index].options = [""];
        updated[index].scaleOptions = null;
        updated[index].scaleValues = null;
      }
    }

    setQuestions(updated);
  };


  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleAddOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const handleRemoveOption = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(oIndex, 1);
    setQuestions(updated);
  };

  const handleSave = () => {
    const dataInput = {
      surveyId: surveyId,
      adminId: admin.id,
      questionsData: questions.map((question, index) => {
        return {
          question: question.question,
          type: question.type,
          required: question.required,
          displayOrder: parseInt(lengthQuestion) + (index + 1),
          options: question.options,
          scaleOptions: question.scaleOptions,
          scaleValues: question.scaleValues,
        }
      })
    }
    const createQuestion = async () => {
      try {
        const responses = await fetch(`${urlApi}/question`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataInput),
        });
        const dataQuestion = await responses.json();
        if (!responses.ok) throw new Error(dataQuestion.message || dataQuestion.error);
        console.log(dataQuestion);
        if (responses.ok) {
          onSuccessSumbit();
          AlertSuccess({ text: "Pertanyaan berhasil disimpan!" })
          setQuestions([]);
          handleClose()
        }
      } catch (error) {
        AlertFailed({ text: error.message })
      }
    }
    createQuestion();

    // Here you would typically send data to API
  };

  const handleCancel = () => {
    setQuestions([]);
    handleClose()
  };

  const handleDeleteQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const renderAnswerInput = (q, index) => {
    switch (q.type) {
      case "text":
        return <input type="text" placeholder="Jawaban teks" className="border-b-1 border-gray-300 p-2 w-full mt-2" disabled />;
      case "opsi":
        return (
          <div className="space-y-2 mt-2">
            {q.options.map((opt, oIdx) => (
              <div key={oIdx} className="flex items-center space-x-2">
                <input type="radio" disabled className='-mb-0.5' />
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(index, oIdx, e.target.value)}
                  className="hover:border-gray-300 border-b-1 border-white p-1 w-full outline-0 focus:border-gray-500"
                  placeholder={`Opsi ${oIdx + 1}`}
                />
                <div
                  onClick={() => handleRemoveOption(index, oIdx)}
                  className='cursor-pointer text-gray-500 hover:text-red-500'
                >
                  <IoClose />
                </div>
              </div>
            ))}
            <button
              onClick={() => handleAddOption(index)}
              className="text-blue-500 text-sm mt-1 cursor-pointer"
            >
              + Tambah Opsi
            </button>
          </div>
        );
      case "skala":
        return (
          <div className="mt-2">
            <div className="flex flex-col space-y-2 items-start">
              {q.scaleOptions.map((label, oIdx) => (
                <label key={oIdx} className="flex items-center gap-3 w-full">
                  <input type="radio" disabled className='-mb-0.5' />
                  <span className="flex-1">{label}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Nilai: {q.scaleValues[oIdx]}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Buat Pertanyaan</h2>
      {questions.map((q, index) => (
        <div key={index} className="p-4 rounded-md mb-4 space-y-2 w-150 bg-white shadow-md">
          <div className='flex justify-end'>
            <select
              value={q.type}
              onChange={(e) => handleQuestionChange(index, "type", e.target.value)}
              className="p-2 w-30 rounded-md bg-slate-100 shadow-md cursor-pointer border border-gray-300 text-xs outline-0"
            >
              <option value="text">Teks</option>
              <option value="opsi">Opsi Pilihan</option>
              <option value="skala">Skala</option>
            </select>
          </div>
          <textarea
            value={q.question}
            onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
            rows={1}
            placeholder="Tulis pertanyaan..."
            className="p-2 w-full outline-0 border-b-1 border-gray-300 focus:border-gray-500 focus:border-b-2 overflow-y-hidden whitespace-pre-wrap break-words"
          />

          {renderAnswerInput(q, index)}
          <div className='flex gap-4 justify-end items-end mt-3'>
            <button
              onClick={() => handleDeleteQuestion(index)}
              className="text-red-400 text-sm flex items-center hover:text-red-500 cursor-pointer"
            >
              <FaTrashCan size={16} />
            </button>
            <label className="flex items-center justify-center space-x-2 pl-4 border-l border-gray-400 cursor-pointer">
              <input
                className='cursor-pointer'
                type="checkbox"
                checked={q.required}
                onChange={(e) => handleQuestionChange(index, "required", e.target.checked)}
              />
              <span className='text-xs'>Wajib diisi</span>
            </label>
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-6">

        <button
          onClick={handleAddQuestion}
          className="bg-biru-muda text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600"
        >
          + Tambah Pertanyaan
        </button>
        {questions.length === 0 && (
          <button
            onClick={handleCancel}
            className="bg-red-200 ml-5 text-red-800 px-4 py-2 rounded-md cursor-pointer hover:bg-red-300"
          >
            Batal
          </button>
        )}
        {questions.length > 0 && (
          <div className='flex gap-5'>
            <button
              onClick={handleCancel}
              className="bg-red-200 text-red-800 px-4 py-2 rounded-md cursor-pointer hover:bg-red-300"
            >
              Batal
            </button>

            <button
              onClick={handleSave}
              className="bg-blue-200 text-biru-tua px-4 py-2 rounded-md cursor-pointer hover:bg-blue-300"
              disabled={questions.length === 0}
            >
              Simpan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


export { PopupCreateSurvey, PopupCreateService, PopupCreateQuestion };