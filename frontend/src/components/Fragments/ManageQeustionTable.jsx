import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import KebabMenu from '../Elements/KebabMenu';
// import PopupEditForm from "../Fragments/PopupEdit";
import PopupDetail from "../Fragments/PopupDetail";
import { useState, Fragment } from "react";
import { PopupEditQuestion } from './PopupEdit';

const ManageQuestionTable = ({ data, header, width = "" }) => {
  const [showPopupDetail, setShowPopupDetail] = useState(false);
  const [dataDetailQuestion, setDataDetailQuestion] = useState({});
  const [showEditQuestion, setShowEditQuestion] = useState(false);
  const [questionIdToEdit, setQuestionIdToEdit] = useState(null);
  const [dataToEdit, setDataToEdit] = useState({});

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
      questionId: data.questionId,           // Required untuk edit
      question: data.questionText,
      type: data.questionType,            // "text" | "opsi" | "skala"
      required: data.isRequired,
      displayOrder: data.displayOrder,
      options: [""],  // Untuk type "opsi"
      scaleOptions: null, // Untuk type "skala"
      scaleValues: null               // Untuk type "skala"
    }
    if (data.questionType === "opsi") {
      dataEdit.options = data.option
    } else if (data.questionType === "skala") {
      dataEdit.scaleOptions = ["Sangat Setuju", "Setuju", "Tidak Setuju", "Sangat Tidak Setuju"]
      dataEdit.scaleValues = [4, 3, 2, 1]
    }
    console.log("ini data", dataEdit)
    setDataToEdit(dataEdit);
  }

  const handleToPopupEdit = () => {
    setShowPopupDetail(false);
  }

  const handleEditQuestion = (id, dataQuestion) => {
    processDataEdit(dataQuestion)
    setQuestionIdToEdit(id);
    setShowEditQuestion(true);
  }

  const handleSubmitEdit = (id) => {
    setShowEditQuestion(false);
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
                          onDelete={() => { }}
                          onEdit={() => handleEditQuestion(item.questionId, item)}
                          onDetail={() => handleOpenPopupDetail(item.questionId)}
                        />
                      </TableCell>
                    </TableRow>

                    {showEditQuestion && questionIdToEdit === item.questionId && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <div className=" ">
                            <PopupEditQuestion
                              surveyId={item.surveyId}
                              initialQuestion={dataToEdit}
                              handleClose={() => {
                                setShowEditQuestion(false);
                                setQuestionIdToEdit(null);
                              }}
                              onSuccessSubmit={() => handleSubmitEdit(item.surveyId)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
