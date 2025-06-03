import { useState, useEffect } from "react";
import urlApi from "../../api/urlApi";
import FormQuestionSurvey from "../Fragments/FormQuestionSurvey";

const FormSurvey = () => {
  const [pageActive, setPageActive] = useState(1);
  // ? isi nya array yang berisi data survey
  const [dataForm, setDataForm] = useState([]);
  // ? isi nya id survey yang sedang tampil di layar
  const [SurveyAvtive, setSurveyActive] = useState(null);
  // ? isi nya object lyang ada data survey dan ada list questionnya
  const [listQuestion, setListQuestion] = useState([]);
  // ? isi nya array list service untuk option survey
  const [listService, setListService] = useState([]);
  const [allQuestion, setAllQuestion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2, res3] = await Promise.all([
          fetch(`${urlApi}/survey`),
          fetch(`${urlApi}/service`),
          fetch(`${urlApi}/question`)
        ]);
        const surveys = await res1.json();
        const services = await res2.json();
        const questions = await res3.json();
        if (surveys.error || services.error || questions.error) {
          throw new Error(surveys.error || services.error || questions.error);
        }
        const surveyPublished = surveys.data.filter(item => item.isPublished === true);
        setDataForm(surveyPublished);

        if (surveyPublished.length > 0) {
          setSurveyActive(surveyPublished[0].surveyId); // ini akan memicu useEffect di bawah
        }
        setListService(services.data);

        const questionActive = questions.data.filter(question => question.isActive === true);
        setAllQuestion(questionActive);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!SurveyAvtive) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`${urlApi}/survey/${SurveyAvtive}/questions`);
        const survey = await response.json();
        if (!response.ok) throw new Error(survey.error);
        const questionActive = survey.data.question.filter(question => question.isActive === true);
        setListQuestion(questionActive);
      } catch (error) {
        setError(error.message);
      }
    }
    fetchData();
  }, [SurveyAvtive]);

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
        if (!response.ok) {
          const errorMsg = typeof data.error === 'string'
            ? data.error
            : JSON.stringify(data.error, null, 2);
          throw new Error(errorMsg);
        }
        setLoadingSubmit(false);
      } catch (error) {
        setError(error.message);
      }
    }
    postData();
    localStorage.removeItem("survey-answers");
  };

  if (loading) return <div className="h-screen w-sreen flex justify-center items-center"><p className="text-2xl text-sky-400">Loading...</p></div>;
  if (error) return <div className="h-screen w-sreen flex justify-center items-center"><p className="text-lg text-red-400">Error: {error}</p></div>;

  return (
    <>
      <section className="bg-sky-100 w-full min-h-screen h-max relative pb-10">
        <div className="py-5 flex flex-col gap-10 justify-center items-center">

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
      </section>
    </>
  )
}
export default FormSurvey
