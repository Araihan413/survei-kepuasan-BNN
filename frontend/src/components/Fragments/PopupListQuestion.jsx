import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { IoClose } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import urlApi from "../../api/urlApi";
import { useState, useEffect } from 'react';


const PopupListQuestion = ({ openPopUp, handleClose, dataSurveys, onUpdateSurveys }) => {
  const [error, setError] = useState(null);
  const [openActivateQuestion, setOpenActivateQuestion] = useState(false);
  const [listQuestion, setListQuestion] = useState([]);
  const [questionActive, setQuestionActive] = useState([]);
  const [surveyIdBeingEdited, setSurveyIdBeingEdited] = useState(null);

  useEffect(() => {
    if (openPopUp && dataSurveys && dataSurveys.length > 0) {
      const updatedActiveQuestions = dataSurveys.map(item => {
        return {
          ...item,
          question: item.question ? item.question.filter(q => q.isActive) : []
        };
      });
      setQuestionActive(updatedActiveQuestions);
    }
  }, [openPopUp, dataSurveys]);

  const fetchQuestionBySurveyId = async (idSurvey) => {
    try {
      const survey = await fetch(`${urlApi}/survey/${idSurvey}/questions`);
      if (!survey.ok) throw new Error(survey.error);
      const dataSurvey = await survey.json();
      const question = dataSurvey.data.question;
      setListQuestion(question);

      const updatedActiveQuestions = dataSurveys.map(item => {
        if (item.surveyId === idSurvey) {
          return {
            ...item,
            question: question.filter(q => q.isActive)
          };
        }
        return item;
      });

      setQuestionActive(updatedActiveQuestions);


    } catch (error) {
      setError(error.message);
    }
  };

  const openPopupActivate = (idSurvey) => {
    setSurveyIdBeingEdited(idSurvey);
    fetchQuestionBySurveyId(idSurvey);
    setOpenActivateQuestion(true);
  }
  const closePopupActivate = () => {
    setOpenActivateQuestion(false);
  }
  const handleSetNonActiveQuestion = (idQuestion, idSurvey) => {
    const updateData = async () => {
      try {
        const response = await fetch(`${urlApi}/question/${parseInt(idQuestion)}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ isActive: false })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        await fetchQuestionBySurveyId(idSurvey);
        onUpdateSurveys?.(questionActive);
        return data
      } catch (error) {
        setError(error.message);
      }
    }
    updateData();
  }


  return (
    <div>
      <Dialog open={openPopUp} onClose={handleClose} fullWidth maxWidth="md">
        <div className='text-center'>
          <DialogTitle sx={{ fontWeight: "bold" }}>Kelola Pertanyaan Survei</DialogTitle>
        </div>
        <DialogContent>
          <div className='px-5'>
            {questionActive && questionActive.length > 0 ? (
              questionActive.map((item) => {
                return (
                  <div key={item.surveyId} className='border-t-1 border-gray-500 pt-5 pb-6'>
                    <div className='mb-5 text-center'>
                      <h1 className='text-lg font-bold'>{item.title}</h1>
                    </div>
                    <div className='flex flex-col gap-3'>
                      {item.question.map((question) => (
                        <div key={question.questionId} className='bg-slate-200 px-4 pr-10 py-2 flex items-center rounded-md relative'>
                          <DialogContentText>
                            {question.questionText}
                          </DialogContentText>
                          {question.isPersonal ? null : (
                            <div className='absolute right-0 text-xlflex items-center pr-2 '>
                              <button onClick={() => handleSetNonActiveQuestion(question.questionId, item.surveyId)} className='p-1 cursor-pointer hover:bg-slate-300 rounded-md'><IoClose /></button>
                            </div>
                          )}
                        </div>
                      ))}

                    </div>
                    {item.isPersonal ? null : (
                      <div className='flex justify-end items-center mt-5'>
                        <button onClick={() => openPopupActivate(item.surveyId)} className='text-sky-400 text-4xl cursor-pointer'>
                          <IoMdAddCircle />
                        </button>
                        <PopupSelectActiveQuestion
                          open={openActivateQuestion}
                          closePopup={closePopupActivate}
                          dataQuestion={listQuestion}
                          onSaved={() => {
                            if (surveyIdBeingEdited) {
                              fetchQuestionBySurveyId(surveyIdBeingEdited).then(() => {
                                // Panggil props update agar halaman utama ikut tahu perubahan
                                onUpdateSurveys?.(questionActive); // atau gunakan dataSurveys terbaru
                              });;
                            }
                          }} />
                      </div>
                    )}
                  </div>
                )
              })

            ) : (
              <p className='text-center text-biru-muda'>Memuat pertanyaan...</p>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Tutup</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default PopupListQuestion



const PopupSelectActiveQuestion = ({ open, closePopup, dataQuestion, onSaved }) => {
  const [selectedQuestions, setSelectedQuestions] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dataQuestion && dataQuestion.length > 0) {
      const initialSelection = {};
      dataQuestion.forEach((q) => {
        // ingin centang jika q.isActive === true
        if (q.isActive) {
          initialSelection[q.questionId] = true;
        }
      });
      setSelectedQuestions(initialSelection);
    }
  }, [dataQuestion]);

  const handleSave = async () => {
    setLoading(true);  // Tampilkan loading
    setError(null);
    // Ubah hasil ke format sesuai kebutuhan API
    const updatedQuestions = Object.entries(selectedQuestions).map(([id, isActive]) => ({
      questionId: parseInt(id),
      isActive: isActive
    }));

    const updateQuestion = async (idQuestion, dataQuestion) => {
      try {
        const response = await fetch(`${urlApi}/question/${idQuestion}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataQuestion)
        })
        if (!response.ok) throw new Error(response.error);
      } catch (error) {
        throw error.message;
      }

    }
    try {
      await Promise.all(
        updatedQuestions.map((item) =>
          updateQuestion(item.questionId, { isActive: item.isActive })
        )
      );
      onSaved?.();
      closePopup();
    } catch (error) {
      setError(error.message || 'Terjadi kesalahan saat menyimpan');
    } finally {
      setLoading(false); // Selesai loading
    }

    // Kirim ke backend pakai fetch
  };

  const handleCheckboxChange = (id) => {
    setSelectedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  return (
    <div>
      <Dialog open={open} onClose={closePopup}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Daftar Pertanyaan</DialogTitle>
        <DialogContent>
          <div className='flex flex-col'>
            {dataQuestion.map((item, index) => {
              return (
                <div key={item.questionId} className='px-4 pr-6 py-2 flex items-center relative border-t-1'>
                  <div className='flex items-start gap-2 w-full'>
                    <h1 className='-mt-0.5'>{index + 1}.</h1>
                    <DialogContentText>
                      {item.questionText}
                    </DialogContentText>
                  </div>
                  <div className='absolute right-0'>
                    <input type="checkbox"
                      className='w-4 h-4'
                      checked={selectedQuestions[item.questionId] || false}
                      onChange={() => handleCheckboxChange(item.questionId)}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </DialogContent>
        <DialogActions>
          <Button sx={{ background: "#0575E6", color: "white" }}
            onClick={handleSave}
            disabled={loading}
          >{loading ? 'Menyimpan...' : 'Simpan'}</Button>
          <Button onClick={closePopup}>Tutup</Button>
        </DialogActions>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </Dialog>
    </div>
  )
}