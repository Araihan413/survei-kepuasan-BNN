import KebabMenu from "../Elements/KebabMenu";
import PopupEdit from "../Fragments/PopupEdit";
import { useState, useEffect } from "react";
import { RiSurveyLine } from "react-icons/ri";
import Button from "../Elements/Button";
import PopupDetail from "../Fragments/PopupDetail";
import PopupListQuestion from "../Fragments/PopupListQuestion";
import urlApi from "../../api/urlApi";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FaCirclePlus } from "react-icons/fa6";
import { PopupCreateSurvey } from "../Fragments/PopupAdd";
import { AlertSuccess, AlertFailed } from "../Elements/Alert";
import { useNavigate } from "react-router-dom";
import CopyLinkButton from "../Elements/CopyLinkButton";
import useUpdateAccessToken from "../utils/UpdateToken";

const layoutDataSurvey = [
  { key: "title", label: "Nama", type: "text", accessEdit: true, validation: { required: 'Nama produk wajib diisi' } },
  { key: "description", label: "Deskripsi", type: "textArea", accessEdit: true, validation: {} },
  { key: "createdAt", label: "Tanggal Buat", type: "text", accessEdit: false, validation: {} },
  { key: "adminName", label: "Dibuat Oleh", type: "text", accessEdit: false, validation: {} },
  { key: "totalQuestion", label: "Jumlah Pertanyaan Aktif", type: "text", accessEdit: false, validation: {} },
];

const Survey = () => {
  const updateAccessToken = useUpdateAccessToken();
  const [openPopupListQuestion, setOpenPopupListQuestion] = useState(false);
  const [allSurveyAndQuestion, setAllSurveyAndQuestion] = useState([]);
  const [toggles, setToggles] = useState({});
  const [listSurvei, setListSurvei] = useState([]);
  const [showPopupEdit, setShowPopupEdit] = useState(false);
  const [showPopupDetail, setShowPopupDetail] = useState(false);
  const [dataDetailSurvey, setDataDetailSurvey] = useState({});
  const [showPopupAddSurvey, setShowPopupAddSurvey] = useState(false);
  const navigate = useNavigate();

  const ChangeFormatDate = (dateFormat) => {
    const date = new Date(dateFormat);
    const opsi = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('id-ID', opsi).format(date);
  };

  const fetchDataDetailSurvey = async (id) => {
    try {
      const response = await fetch(`${urlApi}/survey/${id}`);
      const survey = await response.json();
      if (!response.ok) throw new Error(survey.message || survey.error);
      const templateDetail = {
        id: survey.data.surveyId,
        title: survey.data.title ?? '',
        description: survey.data.description ?? '',
        isPublished: survey.data.isPublished,
        createdAt: ChangeFormatDate(survey.data.createdAt) ?? '',
        adminName: survey.data.admin.name ?? '',
        totalQuestion: survey.data._count.question ?? 0
      };
      setDataDetailSurvey(templateDetail);
    } catch (error) {
      AlertFailed({ text: error.message });
    }
  };

  const handleOpen = () => {
    const fetchData = async () => {
      try {
        const surveys = await fetch(`${urlApi}/survey/questions`);
        const dataSurveys = await surveys.json();
        if (!surveys.ok) throw new Error(dataSurveys.message || dataSurveys.error);
        const surveysActive = dataSurveys.data?.filter(item => item.isPublished);
        setAllSurveyAndQuestion(surveysActive);
      } catch (error) {
        AlertFailed({ text: error.message });
      }
    };
    fetchData();
    setOpenPopupListQuestion(true);
  };

  const handleCloseManageQuestion = () => setOpenPopupListQuestion(false);

  const handleOpenPopupEdit = (id) => {
    fetchDataDetailSurvey(id);
    setShowPopupEdit(true);
  };

  const handleOpenPopupDetail = (id) => {
    fetchDataDetailSurvey(id);
    setShowPopupDetail(true);
  };

  const handleToPopupEdit = () => {
    setShowPopupDetail(false);
    setShowPopupEdit(true);
  };

  const handleToggle = (id) => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${urlApi}/survey/${id}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify({ isPublished: !toggles[id] }),
        });
        if (response.status === 403 || response.status === 401) {
          const resJson = await response.json();

          // Cek pesan dari backend
          if (
            resJson?.error?.includes("token tidak valid") ||
            resJson?.error?.includes("expired") ||
            resJson?.error?.includes("Sesi telah berakhir")
          ) {
            updateAccessToken(null); // ⬅️ Redirect ke login
            return;
          }
        }
        // ! update token
        const newToken = response.headers.get("New-Access-Token");
        updateAccessToken(newToken); // update token baru kalau ada

        const newData = await response.json();
        if (!response.ok) throw new Error(newData.message || newData.error);
        setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
      } catch (error) {
        AlertFailed({ text: error.message });
      }
    };
    fetchData();
  };

  const fetchDataSurvey = async () => {
    try {
      const surveys = await fetch(`${urlApi}/survey`);
      const listSurveys = await surveys.json();
      if (!surveys.ok) throw new Error(listSurveys.message || listSurveys.error);
      setListSurvei(listSurveys.data);
      const infoActiveSurvey = listSurveys.data.reduce((acc, item) => {
        acc[item.surveyId] = item.isPublished;
        return acc;
      }, {});
      setToggles(infoActiveSurvey);
    } catch (error) {
      AlertFailed({ text: error.message });
    }
  };

  useEffect(() => {
    fetchDataSurvey();
  }, []);

  const handleAddSurvey = () => setShowPopupAddSurvey(true);

  const handleUpdateSurvey = (updatedData) => {
    const fetchData = async (id) => {
      try {
        const response = await fetch(`${urlApi}/survey/${id}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify({
            title: updatedData.title,
            description: updatedData.description,
          }),
        });
        if (response.status === 403 || response.status === 401) {
          const resJson = await response.json();

          // Cek pesan dari backend
          if (
            resJson?.error?.includes("token tidak valid") ||
            resJson?.error?.includes("expired") ||
            resJson?.error?.includes("Sesi telah berakhir")
          ) {
            updateAccessToken(null); // ⬅️ Redirect ke login
            return;
          }
        }
        // ! update token
        const newToken = response.headers.get("New-Access-Token");
        updateAccessToken(newToken); // update token baru kalau ada

        if (!response.ok) {
          throw new Error("Gagal update survey");
        }
        fetchDataSurvey();
        AlertSuccess({ text: 'Data berhasil diedit!' });
      } catch (error) {
        AlertFailed({ text: error.message });
      }
    };
    fetchData(updatedData.id);
  };

  const handleSuccessCreateSurvey = () => {
    fetchDataSurvey();
  };

  const handleDeleteSurvey = (id) => {
    const confirSurvey = listSurvei.find(item => item.surveyId === id);
    if (!confirSurvey) return
    if (confirSurvey.isPersonal) {
      return AlertFailed({ text: 'Survei Biodata tidak dapat dihapus!' });
    }
    const deleteSurvey = async (id) => {
      try {
        const responses = await fetch(`${urlApi}/survey/${id}`, {
          method: "DELETE",
          credentials: "include",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        if (responses.status === 403 || responses.status === 401) {
          const resJson = await responses.json();

          // Cek pesan dari backend
          if (
            resJson?.error?.includes("token tidak valid") ||
            resJson?.error?.includes("expired") ||
            resJson?.error?.includes("Sesi telah berakhir")
          ) {
            updateAccessToken(null); // ⬅️ Redirect ke login
            return;
          }
        }
        // ! update token
        const newToken = responses.headers.get("New-Access-Token");
        updateAccessToken(newToken); // update token baru kalau ada

        const dataSurvey = await responses.json()
        if (!responses.ok) throw new Error(dataSurvey.message || dataSurvey.error);
        AlertSuccess({ text: 'Data survei berhasil dihapus!' });
        fetchDataSurvey();
      } catch (error) {
        AlertFailed({ text: error.message });
      }
    }
    deleteSurvey(id)
  };

  return (
    <section className="p-5">
      <div className="bg-white rounded-xl shadow-md px-5 pt-5 pb-20">
        <div className="flex justify-between">
          <h1 className="text-lg font-bold text-gray-700">Survei Yang Terdaftar di BNN Sleman</h1>
          <div className="flex w-max text-sm gap-4">
            <CopyLinkButton text="Salin Link" />
            <Button icon={<RiSurveyLine className="text-xl text-biru-muda" />} text="Kelola Pertanyaan" color="bg-white" style="border-1 border-biru-muda/80 active:bg-slate-100 text-biru-muda text-xs" onClick={handleOpen} />
          </div>
        </div>

        <PopupListQuestion
          openPopUp={openPopupListQuestion}
          handleClose={handleCloseManageQuestion}
          dataSurveys={allSurveyAndQuestion}
          onUpdateSurveys={() => { }}
        />

        <div className="flex flex-col gap-5 mt-10">
          {listSurvei.map((item) => (
            <div key={item.surveyId} className="bg-slate-50 shadow-md rounded-xl px-5 py-3 flex justify-between">
              <div onClick={() => navigate(`/survei/kelola`)} className=" cursor-pointer">
                <h1 className="text-md font-semibold text-gray-700 mb-1">{item.title}</h1>
                <p className="text-xs text-gray-400">{ChangeFormatDate(item.createdAt)}</p>
              </div>
              <div className="flex gap-5">
                <FormControlLabel
                  control={<Switch checked={toggles[item.surveyId]} onChange={item.isPersonal ? (e) => e.preventDefault() : () => handleToggle(item.surveyId)} disabled={!!item.isPersonal} />}
                  label={item.isPersonal ? "Aktif" : toggles[item.surveyId] ? "Aktif" : "Nonaktif"}
                />
                <KebabMenu
                  onEdit={() => handleOpenPopupEdit(item.surveyId)}
                  onDelete={() => handleDeleteSurvey(item.surveyId)}
                  onDetail={() => handleOpenPopupDetail(item.surveyId)}
                />
              </div>
            </div>
          ))}

          <PopupEdit
            dataPopup={dataDetailSurvey}
            open={showPopupEdit}
            handleClose={() => setShowPopupEdit(false)}
            layoutForm={layoutDataSurvey}
            onSubmitSuccess={handleUpdateSurvey}
          />

          <PopupDetail
            open={showPopupDetail}
            handleClose={() => setShowPopupDetail(false)}
            dataPopup={dataDetailSurvey}
            layoutForm={layoutDataSurvey}
            handleToPopupEdit={handleToPopupEdit}
          />
        </div>
      </div>

      <button type="button" className="text-biru-muda active:text-biru-muda/80 active:scale-95 cursor-pointer fixed bottom-14 right-9 text-5xl" onClick={handleAddSurvey}>
        <FaCirclePlus />
      </button>

      <PopupCreateSurvey
        open={showPopupAddSurvey}
        handleCancel={() => setShowPopupAddSurvey(false)}
        lengthSurvey={listSurvei.length}
        onSuccessAdd={handleSuccessCreateSurvey}
      />
    </section>
  );
};

export default Survey;
