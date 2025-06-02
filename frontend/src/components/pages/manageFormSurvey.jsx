import { useNavigate } from "react-router-dom";
import { FaRegBell, FaPalette } from "react-icons/fa6";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoIosArrowForward, IoMdSave } from "react-icons/io";
import { IoLink, IoEye } from "react-icons/io5";
import { LuClipboardPen } from "react-icons/lu";
import Button from "../Elements/Button";
import { useState, useEffect, useRef } from "react";
import urlApi from "../../api/urlApi";
import PopupListQuestion from "../Fragments/PopupListQuestion";
import { set } from "react-hook-form";

const ManageFormSurvey = () => {
  const navigasi = useNavigate();
  const [pageActive, setPageActive] = useState(1);
  // ? isi nya array yang berisi data survey
  const [dataForm, setDataForm] = useState([]);
  // ? isi nya id survey yang sedang tampil di layar
  const [surveyActive, setSurveyActive] = useState(null);
  // ? isi nya object lyang ada data survey dan ada list questionnya
  const [listQuestion, setListQuestion] = useState([]);
  // ? isi nya array list service untuk option survey
  const [listService, setListService] = useState([]);
  // ? berisi semua survei beserta questionnya
  const [allSurvey, setAllSurvey] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openPopupListQuestion, setOpenPopupListQuestion] = useState(false);

  const fetchQuestionBySurveyId = async (surveyId) => {
    try {
      const response = await fetch(`${urlApi}/survey/${surveyId}/questions`);
      const survey = await response.json();
      if (!response.ok) throw new Error(survey.error);
      const questionActive = survey.data.question.filter(question => question.isActive === true);
      setListQuestion(questionActive);
    } catch (error) {
      setError(error.message);
    }
  };


  const handleOpen = () => {
    const fetchData = async () => {
      try {
        const surveys = await fetch(`${urlApi}/survey/questions`);
        if (!surveys.ok) throw new Error(surveys.error);
        const dataSurveys = await surveys.json();
        const surveysActive = dataSurveys.data?.filter(item => item.isPublished);
        setAllSurvey(surveysActive);
      } catch (error) {
        setError(error.message);
      }
    }
    fetchData();
    setOpenPopupListQuestion(true);
  }
  const handleClose = () => {
    setOpenPopupListQuestion(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          fetch(`${urlApi}/survey`),
          fetch(`${urlApi}/service`)
        ]);
        const surveys = await res1.json();
        const services = await res2.json();
        if (surveys.error || services.error) {
          throw new Error(surveys.error || services.error);
        }
        const surveyPublished = surveys.data.filter(item => item.isPublished === true);
        setDataForm(surveyPublished);

        if (surveyPublished.length > 0) {
          setSurveyActive(surveyPublished[0].surveyId); // ini akan memicu useEffect di bawah
        }
        setListService(services.data);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    if (!surveyActive) return;
    fetchQuestionBySurveyId(surveyActive);
  }, [surveyActive]);

  useEffect(() => {
    if (dataForm.length > 0) {
      setSurveyActive(dataForm[pageActive - 1].surveyId);
    }
  }, [pageActive]);

  const handleChangePage = (item, index) => {
    setPageActive(index + 1);
    setSurveyActive(item.surveyId);
  };

  const handleNextPage = async () => {
    setPageActive(next => next + 1);
  };

  const handlePrevPage = () => {
    setPageActive(prev => prev - 1);
  };

  if (loading) return <div className="h-screen w-screen flex justify-center items-center"><p className="text-2xl text-sky-400">Loading...</p></div>;
  if (error) return <div className="h-screen w-screen flex justify-center items-center"><p className="text-lg text-red-400">Error: {error}</p></div>;

  return (
    <>
      <section className="bg-sky-100 w-full min-h-screen h-max relative pb-10">
        {/* ? navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50">
          <div className="bg-white flex justify-between items-center p-5">

            <div className="flex gap-3 items-center cursor-pointer" onClick={() => navigasi("/dashboard")}>
              <img className="w-10" src="/aset/logo/logoBnn.png" alt="logo bnn" />
              <h1 className="text-xl font-bold">SIGAP BNN</h1>
            </div>

            <div className="flex gap-3">
              <div className="flex gap-3 items-center">
                <h1 className="text-gray-700 text-xl font-semibold cursor-pointer" onClick={() => navigasi("/survei")}>Survei </h1>
                <IoIosArrowForward className="text-xl mt-1" />
              </div>
              <h1 className="text-gray-700 text-xl font-semibold">Survei Kepuasan Pelayanan</h1>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-[#dfb400] text-xl bg-[#fff8da]/50 p-2 rounded-md cursor-pointer">
                <FaRegBell />
              </div>
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="w-10 h-10 rounded-xl ">
                  <img src="../aset/profile/profileDefault.png" alt="gambar profile" />
                </div>
                <div className="flex items-start gap-3">
                  <div>
                    <h1 className="font-semibold text-sm">Ahmad Raihan</h1>
                    <p className="text-xs">Admin</p>
                  </div>
                  <div className="mt-1">
                    <MdKeyboardArrowDown />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border-t-1 border-gray-500  flex gap-6 justify-end items-center px-5 py-3">
            <div className="flex gap-8">
              <div className="cursor-pointer">
                <FaPalette className="text-xl text-gray-700" />
              </div>
              <div className="cursor-pointer">
                <IoEye className="text-2xl text-gray-700" />
              </div>
              <div className="cursor-pointer">
                <IoLink className="text-2xl text-gray-700" />
              </div>
            </div>
            <div >
              <Button type="button" text="Simpan" style="text-xs" onClick={() => navigasi("/dashboard")} icon={<IoMdSave className="text-xl text-gray-500" />}></Button>
            </div>
            <div >
              <Button icon={<LuClipboardPen className="text-xl text-biru-muda" />} color="bg-white" style="border-1 border-biru-muda/80 active:bg-slate-100" onClick={handleOpen} />

            </div>
          </div>
        </nav>
        {/* ? popup */}
        <PopupListQuestion
          openPopUp={openPopupListQuestion}
          handleClose={handleClose}
          dataSurveys={allSurvey}
          onUpdateSurveys={() => {
            if (surveyActive) {
              // Trigger fetch ulang data pertanyaan dari survey yang aktif
              fetchQuestionBySurveyId(surveyActive);
            }
          }}
        />

        { }
        <div className="pt-45 flex flex-col gap-10 justify-center items-center">
          <div className="flex gap-8 relative justify-center items-center w-max">
            {dataForm.length > 0 ? (
              <>
                <span className="h-0.5 w-full inline-block absolute bg-sky-400 shadow-xl"></span>
                {dataForm.map((item, index) => (
                  <div
                    key={index}
                    className={`w-9 h-9 flex justify-center items-center rounded-full shadow-md z-10 border border-sky-400 cursor-pointer ${pageActive === index + 1 ? "text-white bg-sky-400" : "text-sky-400 bg-white"
                      }`}
                    onClick={() => handleChangePage(item, index)}
                  >
                    <h1 className="text-sm font-semibold">{index + 1}</h1>
                  </div>
                ))}
              </>
            ) : (
              <p>Loading data...</p>
            )}
          </div>

          <div className="flex flex-col items-center gap-10 w-full px-5">
            <div className="w-full md:w-120 h-30 bg-white shadow-md rounded-xl relative overflow-hidden cursor-pointer">
              <h1>ini gambar</h1>
              <div className="w-full h-full absolute bg-white/0 hover:bg-white/10 hover:backdrop-blur-xs z-10 top-0"></div>
            </div>
            <div className=" w-full md:w-120 h-30 bg-white shadow-md rounded-xl relative overflow-hidden cursor-pointer">
              <h1>ini gambar</h1>
              <div className="w-full h-full absolute bg-white/0 hover:bg-white/10 hover:backdrop-blur-xs z-10 top-0"></div>
            </div>
          </div>

          <FormManageQuestionSurvey
            dataListService={listService}
            dataListQuestion={listQuestion}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            pageActive={pageActive}
            dataForm={dataForm} />
        </div>
      </section>
    </>
  )
}
export default ManageFormSurvey

const FormManageQuestionSurvey = ({ dataListQuestion, dataListService, onNextPage, onPrevPage, pageActive, dataForm }) => {

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
                    type="text"
                    placeholder="Jawaban Anda"
                    className="outline-none border-b-1 border-gray-300 pt-2 pb-1 text-sm"
                  />
                )}

                {item.questionType === "skala" && item.option && (
                  <div className="flex flex-col gap-2">
                    {item.option.map((opt, i) => (
                      <label key={opt.optionId} className="flex items-center gap-3 break-all">
                        <input
                          type="radio"
                          name={item.isPersonal ? `${item.respondentField}` : `question-${item.questionId}`}
                          value={opt.scaleValue}
                          className="mt-1.5 cursor-pointer"
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
                          />
                          {opt.optionText}
                        </label>
                      ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="w-full flex justify-center items-center">
            <div className="flex justify-start max-w-120 gap-4 w-full">
              {pageActive > 1 ? <Button type="button" text="Kembali" color="bg-white" style="text-sky-400 rounded-md" onClick={onPrevPage}></Button> : ''}

              {dataForm.length === pageActive ? "" : <Button type="button" text="Berikutnya" color="bg-white" style="text-sky-400 rounded-md" onClick={onNextPage}></Button>}
            </div>
          </div>

        </form>
      </div>
    </>
  )
}

