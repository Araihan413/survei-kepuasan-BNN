import ManageQuestionTable from "../Fragments/ManageQeustionTable"
import { useState, useEffect, useRef } from "react"
import urlApi from "../../api/urlApi"
import { FaCirclePlus } from "react-icons/fa6";
import { PopupCreateQuestion } from "../Fragments/PopupAdd";
import { AlertFailed } from "../Elements/Alert";

const header = ["Id", "Tipe Pertanyaan", "Pertanyaan", "Admin", '']

const ManageQuestion = () => {
  const [listSurvey, setListSurvey] = useState([]);
  const [dataQuestion, setDataQuestion] = useState({});
  const [surveySelected, setSurveySelected] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopupAddQuestion, setShowAddQuestion] = useState(false);
  const targetScrollRef = useRef(null);

  const handleScroll = () => {
    targetScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (showPopupAddQuestion && targetScrollRef.current) {
      targetScrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showPopupAddQuestion]);

  const fetchDataSurvey = async () => {
    try {
      const surveys = await fetch(`${urlApi}/survey`);
      if (!surveys.ok) throw new Error(surveys.error);
      const listSurveys = await surveys.json();
      setListSurvey(listSurveys.data);
      setSurveySelected(listSurveys.data[0].surveyId);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchDataQuestion = async (id) => {
    setLoading(true);
    try {
      const surveys = await fetch(`${urlApi}/survey/${id}/questions`);
      if (!surveys.ok) throw new Error(surveys.error);
      const listSurveys = await surveys.json();
      setDataQuestion(listSurveys.data);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDataSurvey();
  }, []);

  useEffect(() => {
    if (surveySelected) {
      fetchDataQuestion(surveySelected);
    }
  }, [surveySelected]);

  const handleChangeFilter = (e) => {
    setSurveySelected(e.target.value);
    setShowAddQuestion(false);
  };

  const handleAddQuestion = () => {
    if (!surveySelected) return
    if (dataQuestion.isPersonal) {
      return AlertFailed({ text: 'Survei ini tidak dapat menambah pertanyaan!' });
    }
    handleScroll();
    setShowAddQuestion(true);
  }

  const onSuccessAddQuestion = () => {
    setShowAddQuestion(false);
    fetchDataQuestion(surveySelected);
  }
  return (
    <>
      <section className="py-10 px-5 relative">
        <div className="bg-white rounded-xl shadow-md px-5 pt-5 pb-21">
          <div className="text-start">
            <h1 className="text-lg font-bold text-gray-700">Daftar Pertanyaan</h1>
          </div>

          <div className="flex flex-col mt-10">
            <div className="flex justify-center">
              <select name="survey" id="" onChange={handleChangeFilter} className="cursor-pointer px-4 py-2 bg-slate-100 rounded-md border-1 border-gray-500 text-center font-semibold outline-0">
                {listSurvey.map((survei) => (
                  <option key={survei.surveyId} value={survei.surveyId} >{survei.title}</option>
                ))}
              </select>
            </div>
            <div className="mt-5 flex flex-col gap-20  items-center">
              <div className="w-max flex flex-col justify-center items-center">
                {dataQuestion ? (
                  <div>
                    <ManageQuestionTable width="w-[870px]" header={header} data={dataQuestion.question} />
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-biru-muda/70">Loading...</p>
                )}
              </div>
              {showPopupAddQuestion && (
                <div ref={targetScrollRef} className="bg-slate-200 flex w-full rounded-xl">
                  <PopupCreateQuestion
                    surveyId={surveySelected}
                    lengthQuestion={dataQuestion?.question?.length}
                    handleClose={() => setShowAddQuestion(false)}
                    onSuccessSumbit={onSuccessAddQuestion}
                  />
                </div>
              )}
            </div>

          </div>
        </div>
        <div>
          <button type="button" className="text-biru-muda active:text-biru-muda/80 active:scale-95 cursor-pointer fixed bottom-14 right-9 text-5xl" onClick={handleAddQuestion}>
            <FaCirclePlus />
          </button>
        </div>
      </section >
    </>
  )
}
export default ManageQuestion