import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useEffect, useContext, useState } from 'react';
import { set, useForm } from 'react-hook-form';
import { AuthContext } from '../../AuthContext';
import { IoClose } from "react-icons/io5";
import { AlertFailed, AlertSuccess } from '../Elements/Alert';
import urlApi from '../../api/urlApi';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const PopupEdit = ({ dataPopup, open, handleClose, layoutForm, onSubmitSuccess }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (dataPopup && Object.keys(dataPopup).length > 0) {
      const defaultValues = layoutForm.reduce((acc, item) => {
        acc[item.key] = dataPopup[item.key] ?? ''; // pakai nullish coalescing
        return acc;
      }, {});
      reset(defaultValues);
    }
  }, [dataPopup, reset]);

  const handleToEdit = (data) => {
    const dataAccessEdit = layoutForm.reduce((acc, item) => {
      if (item.accessEdit) {
        acc[item.key] = data[item.key] || '';
      }
      return acc;
    }, {});

    onSubmitSuccess?.({ ...dataAccessEdit, id: dataPopup.id });
    handleClose();
  }

  return (
    <>
      <div>
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", marginBottom: "0px", paddingBottom: "0px" }}>Detail Survei</DialogTitle>
          {dataPopup ? (
            <form onSubmit={handleSubmit(handleToEdit)}>
              <DialogContent>
                {layoutForm.map((item, index) => (
                  <div key={index} className='flex flex-col gap-1 mb-3'>
                    <label htmlFor={item.label} className='font-semibold'>{item.label}</label>
                    {item.type === "textArea" ? (
                      <textarea
                        id={item.label}
                        readOnly={!item.accessEdit}
                        className="py-2 px-3 bg-slate-100 outline-0 rounded-md text-sm border-1 border-gray-300 text-gray-500"
                        {...register(item.key, item.validation)}
                      />
                    ) : (
                      <input
                        type={item.type}
                        id={item.label}
                        readOnly={!item.accessEdit}
                        className="py-2 px-3 bg-slate-100 outline-0 rounded-md text-sm border-1 border-gray-300 text-gray-500"
                        {...register(item.key, item.validation)}
                      />
                    )}
                    {errors[item.key] && (
                      <span className="text-xs text-red-500/70">{errors[item.key]?.message}</span>
                    )}
                  </div>
                ))}
              </DialogContent>
              <DialogActions sx={{ paddingTop: "0px", marginBottom: "0px" }}>
                <Button sx={{ marginRight: "20px" }} onClick={handleClose}>Tutup</Button>
                <Button type='submit' sx={{ backgroundColor: "#0575E6", color: "white" }} >Simpan</Button>
              </DialogActions>
            </form>
          ) : (<p className='text-center text-red-400 py-10'>Data Tidak Ditemukan</p>)}
        </Dialog>
      </div>
    </>
  )
}
export default PopupEdit


export const PopupEditQuestion = ({
  open,
  onClose,
  initialQuestion,
  onSuccessSubmit
}) => {
  const [originalQuestion, setOriginalQuestion] = useState(initialQuestion);
  const [question, setQuestion] = useState({
    ...initialQuestion,
    options: initialQuestion.options ? [...initialQuestion.options] : []
  });
  const { admin } = useContext(AuthContext);
  // const [open, setOpen] = useState(false);

  useEffect(() => {
    setOriginalQuestion(initialQuestion);
    setQuestion({
      ...initialQuestion,
      options: initialQuestion.options ? [...initialQuestion.options] : []
    });
  }, [initialQuestion]);

  const handleQuestionChange = (field, value) => {
    const updated = { ...question, [field]: value };

    if (field === "type") {
      // Reset semua opsi ketika ganti tipe
      updated.options = [];
      updated.scaleOptions = null;
      updated.scaleValues = null;


      if (value === "skala") {
        // Reset ke template skala
        updated.scaleOptions = ["Sangat Setuju", "Setuju", "Tidak Setuju", "Sangat Tidak Setuju"];
        updated.scaleValues = [4, 3, 2, 1];
        updated.options = updated.scaleOptions.map((text, index) => ({
          optionText: text,
          scaleValue: updated.scaleValues[index],
          displayOrder: index + 1
        }));
      }
      else if (value === "opsi") {
        updated.options = [{
          optionText: "",
          displayOrder: 1 // Set displayOrder awal
        }];
        updated.scaleOptions = null;
        updated.scaleValues = null;
      }
      else {
        // Tipe text - kosongkan semua opsi
        updated.options = [];
        updated.scaleOptions = null;
        updated.scaleValues = null;
      }

      // Tandai opsi lama untuk dihapus jika berpindah dari skala
      if (question.type === "skala" && value !== "skala") {
        updated._deletedOptions = originalQuestion.options?.map(opt => opt.optionId) || [];
      }
    }
    setQuestion(updated);
  };

  const handleOptionChange = (oIndex, value) => {
    const updated = { ...question };

    updated.options[oIndex] = {
      ...updated.options[oIndex],
      optionText: value,
      // Pertahankan displayOrder yang ada
      displayOrder: updated.options[oIndex].displayOrder || oIndex + 1,
      ...(updated.options[oIndex]?.optionId && { isModified: true })
    };

    setQuestion(updated);
  };
  const handleAddOption = () => {
    const updated = { ...question };
    const newOrder = updated.options.length + 1;

    updated.options.push({
      optionText: "",
      displayOrder: newOrder // Set displayOrder otomatis
    });

    setQuestion(updated);
  };
  const handleRemoveOption = (oIndex) => {
    const updated = { ...question };
    const removedOption = updated.options[oIndex];

    // Tandai opsi yang dihapus jika memiliki ID
    if (removedOption.optionId) {
      updated._deletedOptions = [
        ...(updated._deletedOptions || []),
        removedOption.optionId
      ];
    }

    // Hapus opsi dari array
    updated.options.splice(oIndex, 1);

    // Perbarui displayOrder untuk semua opsi yang tersisa
    updated.options = updated.options.map((opt, index) => ({
      ...opt,
      displayOrder: index + 1 // Reset urutan mulai dari 1
    }));

    setQuestion(updated);
  };
  const getOptionChanges = () => {
    const changes = {
      toCreate: [],
      toUpdate: [],
      toDelete: []
    };

    // Handle delete hanya jika ada opsi sebelumnya
    if (originalQuestion.options?.length) {
      const originalOptionIds = originalQuestion.options.map(opt => opt.optionId);
      const currentOptionIds = question.options
        ?.map(opt => opt.optionId)
        .filter(Boolean) || [];

      changes.toDelete = originalOptionIds.filter(
        id => !currentOptionIds.includes(id)
      );
    }

    // Handle create berdasarkan tipe
    if (question.type === "skala") {
      if (!question.scaleValues) {
        return changes;
      }
      changes.toCreate = question.options?.map((opt, index) => ({
        optionText: opt.optionText,
        scaleValue: question?.scaleValues[index],
        displayOrder: index + 1,
        questionId: question.questionId
      }));
    }
    else if (question.type === "opsi") {
      changes.toCreate = question.options
        .filter(opt => !opt.optionId) // Hanya opsi baru
        .map((opt, index) => ({
          optionText: opt.optionText,
          displayOrder: opt.displayOrder,
          questionId: question.questionId
        }));
    }

    return changes;
  };

  const handleSave = () => {
    const optionChanges = getOptionChanges();

    // Gabungkan opsi yang dihapus manual
    if (question._deletedOptions?.length) {
      optionChanges.toDelete = [
        ...new Set([
          ...optionChanges.toDelete,
          ...question._deletedOptions
        ])
      ];
    }

    const payload = {
      surveyId: question.surveyId,
      adminId: admin.id,
      questionData: {
        questionId: question.questionId,
        questionText: question.question,
        questionType: question.type,
        isRequired: question.required,
        displayOrder: question.displayOrder
      },
      optionChanges
    };

    const updateQuestion = async () => {
      try {
        const response = await fetch(`${urlApi}/question`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || data.error);

        onSuccessSubmit();
        AlertSuccess({ text: "Pertanyaan berhasil diperbarui!" });
        onClose();
      } catch (error) {
        AlertFailed({ text: error.message });
      }
    };
    updateQuestion();
  };

  const renderAnswerInput = () => {
    switch (question.type) {
      case "text":
        return <input
          type="text"
          placeholder="Jawaban teks"
          className="border-b-1 border-gray-300 p-2 w-full mt-2"
          disabled
        />;
      case "opsi":
        return (
          <div className="space-y-2 mt-2">
            {question.options.map((opt, oIdx) => (
              <div key={opt.optionId || `new-${oIdx}`} className="flex items-center space-x-2">
                <input type="radio" disabled className='-mb-0.5' />
                <input
                  type="text"
                  value={opt.optionText || ""}
                  onChange={(e) => handleOptionChange(oIdx, e.target.value)}
                  className={`hover:border-gray-300 border-b-1 p-1 w-full outline-0 focus:border-gray-500 ${opt.isModified ? 'border-yellow-300 bg-yellow-50' :
                    !opt.optionId ? 'border-green-300 bg-green-50' : 'border-white'
                    }`}
                  placeholder={`Opsi ${oIdx + 1}`}
                />
                <div className='flex items-center'>
                  {opt.optionId && opt.isModified && (
                    <span className='text-xs text-yellow-600 mr-1'>(diedit)</span>
                  )}
                  {!opt.optionId && (
                    <span className='text-xs text-green-600 mr-1'>(baru)</span>
                  )}
                  <div
                    onClick={() => handleRemoveOption(oIdx)}
                    className='cursor-pointer text-gray-500 hover:text-red-500'
                  >
                    <IoClose />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={handleAddOption}
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
              {question.options.map((label, oIdx) => (
                <label key={oIdx} className="flex items-center gap-3 w-full">
                  <input type="radio" disabled className='-mb-0.5' />
                  <span className="flex-1">{label.optionText}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Nilai: {label.scaleValue}
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
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    borderRadius: '10px',
    overflow: 'auto',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={() => { }}
    >
      <Box sx={style}>
        <div className="w-full mx-auto">
          <h1 className='text-lg font-semibold mb-4'>Edit Pertanyaan</h1>
          <div className="p-4 rounded-md mb-4 space-y-2 w-full shadow-md">
            <div className='flex justify-end'>
              <select
                value={question.type || ""}
                onChange={(e) => handleQuestionChange("type", e.target.value)}
                className="p-2 w-30 rounded-md bg-slate-100 shadow-md cursor-pointer border border-gray-300 text-xs outline-0"
              >
                <option value="text">Teks</option>
                <option value="opsi">Opsi Pilihan</option>
                <option value="skala">Skala</option>
              </select>
            </div>

            <textarea
              value={question.question || ""}
              onChange={(e) => handleQuestionChange("question", e.target.value)}
              rows={1}
              placeholder="Tulis pertanyaan..."
              className="p-2 w-full outline-0 border-b-1 border-gray-300 focus:border-gray-500 focus:border-b-2 overflow-y-hidden whitespace-pre-wrap break-words"
            />

            {renderAnswerInput()}

            <div className='flex gap-4 justify-end items-end mt-3'>
              <label className="flex items-center justify-center space-x-2 cursor-pointer">
                <input
                  className='cursor-pointer'
                  type="checkbox"
                  checked={question.required}
                  onChange={(e) => handleQuestionChange("required", e.target.checked)}
                />
                <span className='text-xs'>Wajib diisi</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-5 mt-6">
            <button
              onClick={onClose}
              className="bg-red-200 text-red-800 px-4 py-2 rounded-md cursor-pointer hover:bg-red-300"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-200 text-biru-tua px-4 py-2 rounded-md cursor-pointer hover:bg-blue-300"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};


