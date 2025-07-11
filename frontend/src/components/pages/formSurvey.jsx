import { useState, useEffect } from "react";
import urlApi from "../../api/urlApi";
import FormQuestionSurvey from "../Fragments/FormQuestionSurvey";
import socket from "../../socket";


const FormSurvey = () => {
  const [pageActive, setPageActive] = useState(1);
  // ? isi nya array yang berisi data survey
  const [dataForm, setDataForm] = useState([]);
  // ? isi nya id survey yang sedang tampil di layar
  const [surveyActive, setSurveyActive] = useState(null);
  // ? isi nya object yang ada data survey dan ada list questionnya
  const [listQuestion, setListQuestion] = useState([]);
  // ? isi nya array list service untuk option survey
  const [listService, setListService] = useState([]);
  const [allQuestion, setAllQuestion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState(null);
  const [dataSurveyActive, setDataSurveyActive] = useState(null);
  const [submitSurvey, setSubmitSurvey] = useState(false);
  const [bgColor, setBgColor] = useState('#c5eeff')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2, res3, themeColor] = await Promise.all([
          fetch(`${urlApi}/survey`),
          fetch(`${urlApi}/service`),
          fetch(`${urlApi}/question`),
          fetch(`${urlApi}/themeForm`)
        ]);
        const surveys = await res1.json();
        const services = await res2.json();
        const questions = await res3.json();
        const theme = await themeColor.json();
        if (surveys.error || services.error || questions.error) {
          throw new Error(surveys.error || services.error || questions.error);
        }
        const surveyPublished = surveys.data.filter(item => item.isPublished === true);
        setDataForm(surveyPublished);

        if (surveyPublished.length > 0) {
          setSurveyActive(surveyPublished[0].surveyId); // ini akan memicu useEffect di bawah
        }
        setListService(services.data);

        const colorTheme = theme.data[0].colorTheme
        setBgColor(colorTheme)
        const questionActive = questions.data.filter(question => question.isActive === true);
        setAllQuestion(questionActive);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
    setDataSurveyActive(dataForm.find(item => item.surveyId === surveyActive));
  }, []);

  useEffect(() => {
    if (!surveyActive) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`${urlApi}/survey/${surveyActive}/questions`);
        const survey = await response.json();
        if (!response.ok) throw new Error(survey.error);
        const questionActive = survey.data.question.filter(question => question.isActive === true);
        setListQuestion(questionActive);
      } catch (error) {
        setError(error.message);
      }
    }
    fetchData();
    setDataSurveyActive(dataForm.find(item => item.surveyId === surveyActive));
  }, [surveyActive]);

  useEffect(() => {
    if (dataForm.length > 0) {
      setSurveyActive(dataForm[pageActive - 1].surveyId);
    }
  }, [pageActive]);

  const handleNextPage = async () => {
    setPageActive(next => next + 1);
  };

  const handlePrevPage = () => {
    setPageActive(prev => prev - 1);
  };

  const createNotification = async (data) => {
    const dataNotif = {
      notifText: data.notifText,
      notifType: data.notifType,
    }
    try {
      const response = await fetch(`${urlApi}/notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataNotif),
      });
      const newNotif = await response.json();
      if (!response.ok) throw new Error(newNotif.message || newNotif.error);
      return newNotif.data;
    } catch (error) {
      setError(error.message);
    }
  }

  const handleSubmit = async (response) => {
    const biodata = {};
    const answers = [];

    for (const key in response) {
      const value = response[key];

      if (key.startsWith("question-")) {
        const questionId = parseInt(key.split("-")[1]);
        const question = allQuestion.find(q => q.questionId === questionId);
        if (!question) continue;

        answers.push({
          questionId: question.questionId,
          surveyId: question.surveyId,
          answerText: question.questionType === "text" ? value : null,
          optionId: question.questionType !== "text" ? value : null
        });
      } else {
        biodata[key] = value;
      }
    }

    const dataForm = {
      biodata,
      answers,
    }

    const postData = async () => {
      setLoadingSubmit(true);
      setError(null);

      try {
        const response = await fetch(`${urlApi}/answer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataForm),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || data.error);

        if (response.ok) {
          const notif = await createNotification({
            notifText: `${dataForm.biodata.name.lowerCase()} telah mengisi survei.`,
            notifType: "survei",
          })
          setSubmitSurvey(true);

          // ✅ Emit WebSocket setelah berhasil
          socket.emit("send-new-survey", {
            notifId: notif.notifId,
            name: dataForm.biodata.name,
            timestamp: new Date().toISOString()
          }); // atau `data` jika mau kirim data dari backend
        }

        setLoadingSubmit(false);
        localStorage.removeItem("survey-answers");

      } catch (error) {
        setError(error.message);
        setLoadingSubmit(false);
      }
    }
    postData();
  };


  if (loading) return <div className="h-screen w-sreen flex justify-center items-center"><p className="text-2xl text-sky-400">Loading...</p></div>;
  if (error) return <div className="h-screen w-sreen flex justify-center items-center"><p className="text-lg text-red-400">Error: {error}</p></div>;

  return (
    <>
      <section style={{ backgroundColor: bgColor }} className="w-full min-h-screen h-max relative pb-10">
        {submitSurvey ? (
          <div className="py-5 flex flex-col gap-10 justify-center items-center">
            <div className="flex flex-col items-center gap-3 w-full px-5">
              <div className=" h-max md:w-120 relative rounded-xl overflow-hidden ">
                <img src={dataSurveyActive?.bannerUrl ? dataSurveyActive.bannerUrl : "../aset/image/benner-survei.png"} alt="benner survei" className="w-full" />
              </div>

              <div className=" w-full md:w-120 h-max bg-white shadow-md rounded-xl relative overflow-hidden  text-center">
                <h1 className="p-5 text-xl font-bold py-10">Terima Kasih Telah Mengisi Survei</h1>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-5 flex flex-col gap-10 justify-center items-center">
            <div className="flex flex-col items-center gap-3 w-full px-5">
              <div className=" h-max md:w-120 relative rounded-xl overflow-hidden ">
                <img src={dataSurveyActive?.bannerUrl ? dataSurveyActive.bannerUrl : "../aset/image/benner-survei.png"} alt="benner survei" className="w-full" />
              </div>

              <div className=" w-full md:w-120 h-max bg-white shadow-md rounded-xl relative overflow-hidden  text-center">
                <h1 className="p-5">{dataSurveyActive?.textInformation ? dataSurveyActive.textInformation : "BNN Kabupaten Sleman sedang melakukan survey terhadap pelayanan guna meningkatkan mutu pelayanan kepada masyarakat, dengan itu kami memohon ketersediaannya untuk mengisi survey berikut."}</h1>
              </div>
            </div>

            <FormQuestionSurvey
              dataListService={listService}
              dataListQuestion={listQuestion}
              onSubmit={handleSubmit}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
              pageActive={pageActive}
              dataForm={dataForm}
              loadingSubmit={loadingSubmit} />
          </div>
        )}
      </section>
    </>
  )
}
export default FormSurvey
