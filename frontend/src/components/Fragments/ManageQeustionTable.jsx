import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import KebabMenu from '../Elements/KebabMenu';
import PopupDetail from "../Fragments/PopupDetail";
import { useState, Fragment } from "react";
import { PopupEditQuestion } from './PopupEdit';
import { AlertFailed, AlertSuccess } from '../Elements/Alert';
import urlApi from '../../api/urlApi';
import useUpdateAccessToken from '../utils/UpdateToken';


const ManageQuestionTable = ({ data, header, width = "", onSuccessEdit }) => {
  const [showPopupDetail, setShowPopupDetail] = useState(false);
  const [dataDetailQuestion, setDataDetailQuestion] = useState({});
  const [dataToEdit, setDataToEdit] = useState({});
  const [showModalEdit, setShowModalEdit] = useState(false);
  const updateAccessToken = useUpdateAccessToken();

  const layoutDataQuestion = [
    { key: "questionText", label: "Pertanyaan", type: "textArea" },
    { key: "questionType", label: "tipe Pertanyaan", type: "text" },
    { key: "isActive", label: "Status Pertanyaan", type: "text" },
    { key: "createdAt", label: "Tanggal Dibuat", type: "text" },
    { key: "admin", label: "Dibuat Oleh", type: "text" },
  ]

  const ChangeFormatDate = (dateFormat) => {
    const date = new Date(dateFormat);
    const opsi = { day: 'numeric', month: 'long', year: 'numeric' };
    const result = new Intl.DateTimeFormat('id-ID', opsi).format(date);
    return result
  }
  const handleOpenPopupDetail = (id) => {
    const dataQuestion = data.find((item) => item.questionId === id);
    setDataDetailQuestion({
      questionId: dataQuestion.questionId,
      questionText: dataQuestion.questionText,
      questionType: dataQuestion.questionType,
      isActive: dataQuestion.isActive ? "aktif" : "tidak aktif",
      createdAt: ChangeFormatDate(dataQuestion.createdAt),
      admin: dataQuestion.admin.name
    });
    setShowPopupDetail(true);
  }

  const processDataEdit = (data) => {
    const dataEdit = {
      questionId: data.questionId,
      surveyId: data.surveyId,           // Required untuk edit
      question: data.questionText,
      type: data.questionType,            // "text" | "opsi" | "skala"
      required: data.isRequired,
      displayOrder: data.displayOrder,
      options: [],  // Untuk type "opsi"
    }
    if (data.questionType === "opsi" || data.questionType === "skala") {
      dataEdit.options = data.option
    }
    setDataToEdit(dataEdit);
  }

  const handleToPopupEdit = () => {
    setShowPopupDetail(false);
    setShowModalEdit(true);
  }

  const handleEditQuestion = (id, dataQuestion) => {
    if (dataQuestion.isPersonal) {
      return AlertFailed({ text: 'Survei ini tidak dapat mengedit pertanyaan!' });
    }
    processDataEdit(dataQuestion)
    setShowModalEdit(true);
  }

  const handleDeleteQuestion = (id, dataQuestion) => {
    if (dataQuestion.isPersonal) {
      return AlertFailed({ text: 'Pertanyaan ini tidak dapat dihapus!' });
    }
    const fetchDeleteQuestion = async (id) => {
      try {
        const responses = await fetch(`${urlApi}/question/${id}`, {
          method: "DELETE",
          credentials: "include",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
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


        const dataQuestion = await responses.json()
        if (!responses.ok) throw new Error(dataQuestion.message || dataQuestion.error);
        AlertSuccess({ text: 'Pertanyaan berhasil dihapus!' });
        onSuccessEdit();
      } catch (error) {
        AlertFailed({ text: error.message });
      }
    }
    fetchDeleteQuestion(parseInt(id))
  }

  const handleSubmitEdit = () => {
    onSuccessEdit();
  }

  const handleClosePopupEdit = () => {
    document.activeElement?.blur();
    setShowModalEdit(false);
  }

  return (
    <>
      {data && data.length > 0 && (
        <div className={`overflow-x-auto ${width}`}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow >
                  {header.map((item, index) => (
                    <TableCell key={index} sx={{ paddingTop: 0.5, paddingBottom: 1, textAlign: 'center', fontWeight: 'bold' }}>{item}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  <Fragment key={index}>
                    <TableRow>
                      <TableCell sx={{ textAlign: 'center' }}>{item.questionId}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{item.questionType}</TableCell>
                      <TableCell sx={{ textAlign: 'center', minWidth: 400 }}>{item.questionText}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{item.admin.name}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <KebabMenu
                          onDelete={() => { handleDeleteQuestion(item.questionId, item) }}
                          onEdit={() => handleEditQuestion(item.questionId, item)}
                          onDetail={() => handleOpenPopupDetail(item.questionId)}
                        />
                      </TableCell>
                    </TableRow>
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div className=" ">
            <PopupEditQuestion
              open={showModalEdit}
              onClose={handleClosePopupEdit}
              initialQuestion={dataToEdit}
              onSuccessSubmit={() => handleSubmitEdit()}
            />
          </div>
          <div>
            {/* ? popup */}
            <PopupDetail
              open={showPopupDetail}
              handleClose={() => setShowPopupDetail(false)}
              dataPopup={dataDetailQuestion}
              layoutForm={layoutDataQuestion}
              handleToPopupEdit={handleToPopupEdit}
            />
          </div>
        </div>
      )}
    </>
  )
}
export default ManageQuestionTable
