import { IoMdSave } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { RiSurveyLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import urlApi from "../../api/urlApi";
import Button from "../Elements/Button";
import PopupListQuestion from "../Fragments/PopupListQuestion";
import NavbarTop from "../Fragments/NavbarTop";
import CopyLinkButton from "../Elements/CopyLinkButton";
import ColorPicker from "../Elements/ColorPicker";
import EditOnClickBanner from "../Elements/EditOnClickBanner";
import EditableTextInformation from "../Elements/EditableTextInformation";
import { AlertFailed, AlertSuccess } from "../Elements/Alert";

const ManageFormSurvey = () => {
  // State management
  const [state, setState] = useState({
    loading: true,
    error: null,
    pageActive: 1,
    bgColor: '#c5eeff',
    openPopupListQuestion: false,
    bannerFile: null
  });

  const [surveyData, setSurveyData] = useState({
    surveys: [],         // All published surveys
    activeSurvey: null,  // Currently selected survey
    questions: [],       // Questions for active survey
    services: [],        // All services
    allSurveys: []       // All surveys with questions
  });

  // Derived state
  const activeSurveyIndex = state.pageActive - 1;
  const activeSurvey = surveyData.surveys[activeSurveyIndex] || null;

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [surveysRes, servicesRes] = await Promise.all([
          fetch(`${urlApi}/survey`),
          fetch(`${urlApi}/service`)
        ]);

        const [surveys, services] = await Promise.all([
          surveysRes.json(),
          servicesRes.json()
        ]);

        if (!surveysRes.ok || !servicesRes.ok) {
          throw new Error(surveys.error || services.error);
        }

        const publishedSurveys = surveys.data.filter(item => item.isPublished);

        setSurveyData(prev => ({
          ...prev,
          surveys: publishedSurveys,
          services: services.data,
          activeSurvey: publishedSurveys[0] || null
        }));

        if (publishedSurveys.length > 0) {
          await fetchQuestions(publishedSurveys[0].surveyId);
        }

        setState(prev => ({ ...prev, loading: false }));
      } catch (err) {
        setState(prev => ({ ...prev, error: err.message, loading: false }));
      }
    };

    fetchInitialData();
  }, []);

  // Fetch questions for active survey
  const fetchQuestions = async (surveyId) => {
    try {
      const response = await fetch(`${urlApi}/survey/${surveyId}/questions`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      const activeQuestions = data.data.question.filter(q => q.isActive);

      setSurveyData(prev => ({
        ...prev,
        questions: activeQuestions
      }));
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
    }
  };

  // Fetch all surveys with questions for popup
  const fetchAllSurveys = async () => {
    try {
      const response = await fetch(`${urlApi}/survey/questions`);
      if (!response.ok) throw new Error(response.error);

      const data = await response.json();
      const publishedSurveys = data.data?.filter(item => item.isPublished);

      setSurveyData(prev => ({
        ...prev,
        allSurveys: publishedSurveys
      }));
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
    }
  };

  // Handle page change
  const handleChangePage = async (index) => {
    const newPage = index + 1;
    setState(prev => ({ ...prev, pageActive: newPage }));

    // Update active survey and fetch questions
    const selectedSurvey = surveyData.surveys[index];
    if (selectedSurvey) {
      setSurveyData(prev => ({
        ...prev,
        activeSurvey: selectedSurvey
      }));
      await fetchQuestions(selectedSurvey.surveyId);
    }
  };

  // Handle save survey
  const handleSaveAllSurvey = async () => {
    if (!activeSurvey) return;

    const formData = new FormData();
    if (state.bannerFile) {
      formData.append('banner', state.bannerFile);
    }
    formData.append('textInformation', activeSurvey.textInformation || '');
    formData.append('surveyId', activeSurvey.surveyId);

    try {
      const response = await fetch(`${urlApi}/survey/update`, {
        method: 'POST',
        body: formData,
        // headers: {
        //   'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        // }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const responseData = await response.json();

      // Update state with new data
      setSurveyData(prev => ({
        ...prev,
        surveys: prev.surveys.map(survey =>
          survey.surveyId === activeSurvey.surveyId
            ? {
              ...survey,
              bannerUrl: responseData.data.bannerUrl || survey.bannerUrl,
              textInformation: responseData.data.textInformation || survey.textInformation
            }
            : survey
        ),
        activeSurvey: {
          ...prev.activeSurvey,
          bannerUrl: responseData.data.bannerUrl || prev.activeSurvey.bannerUrl,
          textInformation: responseData.data.textInformation || prev.activeSurvey.textInformation
        }
      }));

      setState(prev => ({ ...prev, bannerFile: null }));
      AlertSuccess({ text: 'Perubahan berhasil disimpan' });

      // Handle new token if exists
      const newToken = response.headers.get('New-Access-Token');
      if (newToken) {
        localStorage.setItem('accessToken', newToken);
      }

    } catch (error) {
      console.error('Error:', error);
      AlertFailed({ text: error.message || 'Terjadi kesalahan saat menyimpan' });
    }
  };

  // Handle text information change
  const handleTextChange = (newText) => {
    setSurveyData(prev => ({
      ...prev,
      activeSurvey: {
        ...prev.activeSurvey,
        textInformation: newText
      }
    }));
  };

  // Open survey in new tab
  const handleToSurvey = () => {
    const url = `${window.location.origin}/surveiBNN`;
    window.open(url, '_blank');
  };

  // Open question management popup
  const handleOpenPopup = async () => {
    await fetchAllSurveys();
    setState(prev => ({ ...prev, openPopupListQuestion: true }));
  };

  // Loading and error states
  if (state.loading) return (
    <div className="h-screen w-screen flex justify-center items-center">
      <p className="text-2xl text-sky-400">Loading...</p>
    </div>
  );

  if (state.error) return (
    <div className="h-screen w-screen flex justify-center items-center">
      <p className="text-lg text-red-400">Error: {state.error}</p>
    </div>
  );

  return (
    <section style={{ backgroundColor: state.bgColor }} className="w-full min-h-screen h-max relative pb-10">
      {/* Navigation bar */}
      <div className="fixed mt-16 top-0 left-0 right-0 z-50">
        <NavbarTop logo={true} />
        <div className="bg-white border-t-1 border-gray-500 flex gap-6 justify-end items-center px-5 py-3 relative shadow-md">
          <div className="flex gap-8">
            <ColorPicker
              bgColor={state.bgColor}
              handleChangeTheme={(color) => setState(prev => ({ ...prev, bgColor: color }))}
            />
            <button className="cursor-pointer" onClick={handleToSurvey}>
              <IoEye className="text-2xl text-gray-700 hover:text-biru-muda" />
            </button>
            <CopyLinkButton simple={true} />
          </div>
          <Button
            type="button"
            text="Simpan"
            style="text-xs"
            onClick={handleSaveAllSurvey}
            icon={<IoMdSave className="text-xl text-gray-500" />}
          />
          <Button
            icon={<RiSurveyLine className="text-xl text-biru-muda" />}
            text="Kelola Pertanyaan"
            color="bg-white"
            style="border-1 border-biru-muda/80 active:bg-slate-100 text-biru-muda text-xs"
            onClick={handleOpenPopup}
          />
        </div>
      </div>

      {/* Question management popup */}
      <PopupListQuestion
        openPopUp={state.openPopupListQuestion}
        handleClose={() => setState(prev => ({ ...prev, openPopupListQuestion: false }))}
        dataSurveys={surveyData.allSurveys}
        onUpdateSurveys={() => activeSurvey && fetchQuestions(activeSurvey.surveyId)}
      />

      {/* Main content */}
      <div className="pt-45 flex flex-col gap-10 justify-center items-center">
        {/* Page navigation */}
        <div className="flex gap-8 relative justify-center items-center w-max">
          {surveyData.surveys.length > 0 && (
            <>
              <span className="h-0.5 w-full inline-block absolute bg-sky-400 shadow-xl"></span>
              {surveyData.surveys.map((item, index) => (
                <div
                  key={index}
                  className={`w-9 h-9 flex justify-center items-center rounded-full shadow-md z-10 border border-sky-400 cursor-pointer ${state.pageActive === index + 1 ? "text-white bg-sky-400" : "text-sky-400 bg-white"
                    }`}
                  onClick={() => handleChangePage(index)}
                >
                  <h1 className="text-sm font-semibold">{index + 1}</h1>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Survey content */}
        <div className="flex flex-col items-center gap-3 w-full px-5">
          {!state.loading && activeSurvey ? (
            <>
              <EditOnClickBanner
                bannerUrl={activeSurvey.bannerUrl || ""}
                defaultBanner="../aset/image/benner-survei.png"
                onBannerChange={(file) => setState(prev => ({ ...prev, bannerFile: file }))}
              />

              <EditableTextInformation
                initialText={activeSurvey.textInformation || ""}
                defaultText="Tulis Informasi Terkait Survei..."
                onTextChange={handleTextChange}
              />
            </>
          ) : (
            <div className="py-10 text-center">Memuat data survei...</div>
          )}
        </div>

        {/* Questions form */}
        <QuestionForm
          questions={surveyData.questions}
          services={surveyData.services}
          pageActive={state.pageActive}
          totalPages={surveyData.surveys.length}
          onPrevPage={() => setState(prev => ({ ...prev, pageActive: prev.pageActive - 1 }))}
          onNextPage={() => setState(prev => ({ ...prev, pageActive: prev.pageActive + 1 }))}
        />
      </div>
    </section>
  );
};

// Question Form Component
const QuestionForm = ({ questions, services, pageActive, totalPages, onPrevPage, onNextPage }) => {
  return (
    <div className="px-5">
      <form className="flex flex-col gap-5 w-full md:w-120" onSubmit={(e) => e.preventDefault()}>
        {questions.map((item, index) => (
          <div key={item.questionId} className="flex flex-col gap-5 bg-white p-5 pb-8 text-sm rounded-md relative shadow-md">
            {/* Question text */}
            <div className="relative w-max max-w-80 md:max-w-110">
              {item.isRequired && <span className="text-red-500 absolute top-0 -right-2">*</span>}
              <label className="block break-words whitespace-normal">
                {pageActive === 1 ? item.questionText : `${index + 1}. ${item.questionText}`}
              </label>
            </div>

            {/* Answer options */}
            {item.questionType === "text" && (
              <input
                type="text"
                placeholder="Jawaban Anda"
                className="outline-none border-b-1 border-gray-300 pt-2 pb-1 text-sm"
              />
            )}

            {item.questionType === "skala" && item.option && (
              <div className="flex flex-col gap-2">
                {item.option.map(opt => (
                  <label key={opt.optionId} className="flex items-center gap-3 break-all">
                    <input
                      type="radio"
                      name={item.isPersonal ? item.respondentField : `question-${item.questionId}`}
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
                  ? services.map(service => (
                    <label key={service.serviceId} className="flex items-center gap-3 break-all">
                      <input
                        type="radio"
                        name={item.isPersonal ? item.respondentField : `question-${item.questionId}`}
                        value={service.serviceId}
                        className="mt-1 cursor-pointer"
                      />
                      {service.name}
                    </label>
                  ))
                  : item.option.map(opt => (
                    <label key={opt.optionId} className="flex items-center gap-3 break-all">
                      <input
                        type="radio"
                        name={item.isPersonal ? item.respondentField : `question-${item.questionId}`}
                        value={item.isPersonal ? opt.optionText : opt.optionId}
                        className="mt-1 cursor-pointer"
                      />
                      {opt.optionText}
                    </label>
                  ))}
              </div>
            )}
          </div>
        ))}

        {/* Navigation buttons */}
        <div className="w-full flex justify-center items-center">
          <div className="flex justify-start max-w-120 gap-4 w-full">
            {pageActive > 1 && (
              <Button
                type="button"
                text="Kembali"
                color="bg-white"
                style="text-sky-400 rounded-md"
                onClick={onPrevPage}
              />
            )}
            {pageActive < totalPages && (
              <Button
                type="button"
                text="Berikutnya"
                color="bg-white"
                style="text-sky-400 rounded-md"
                onClick={onNextPage}
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ManageFormSurvey;