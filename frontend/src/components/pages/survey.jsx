import KebabMenu from "../Elements/KebabMenu";
import ButtonDownload from "../Elements/ButtonDownload";
import { IoLink } from "react-icons/io5";
import PopupEditForm from "../Fragments/PopupEditForm";
import { useState } from "react";
import { LuClipboardPen } from "react-icons/lu";
import Button from "../Elements/Button";
import PopupDetail from "../Fragments/PopupDetail";
import { set } from "react-hook-form";


const survey = [
  {
    id: 1,
    title: "Survei Kepuasan Pelayanan",
    description: "Survei 1",
    isPublished: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01"
  },
  {
    id: 2,
    title: "Survei Persepsi Anti Korupsi",
    description: "Survei 2",
    isPublished: true,
    createdAt: "2023-04-01",
    updatedAt: "2023-05-01"
  },
]

// ? data popup
const formConfig = [
  {
    name: 'nama',
    label: 'nama',
    type: 'text',
    validation: { required: 'Nama produk wajib diisi' }
  },
  {
    name: 'umur',
    label: 'Umur',
    type: 'number',
    readOnly: true,
    validation: { required: 'umur wajib diisi' }
  },
  {
    name: 'deskripsi',
    label: 'deskripsi',
    type: 'text',
    validation: {}
  },
  {
    name: 'harga',
    label: 'harga',
    type: 'number',
    validation: {
      required: 'Harga wajib diisi',
      min: { value: 0, message: 'Harga tidak boleh negatif' }
    }
  },
];

const Survey = () => {

  // ? handle popup and kebab menu
  const [isPopupEditOpen, setIsPopupEditOpen] = useState(false);
  const [isPopupDetailOpen, setIsPopupDetailOpen] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  const handleSubmit = (formData) => {
    console.log('Data yang dikirim:', formData);
    // Lakukan API call atau update state di sini
    setIsPopupEditOpen(false);
  };

  const handleOpenPopupEdit = (data) => {
    setCurrentData(data);
    setIsPopupEditOpen(true);
    setIsPopupDetailOpen(false);
  };
  const handleOpenPopupDetail = (data) => {
    setCurrentData(data);
    setIsPopupDetailOpen(true);
    setIsPopupEditOpen(false);
  };

  const sampleData = {
    id: 1,
    nama: "ahmad raihan",
    deskripsi: 'Survei 1',
    umur: 20,
    harga: 10000
  };

  const ChangeFormatDate = (dateFormat) => {
    const date = new Date(dateFormat);
    const opsi = { day: 'numeric', month: 'long', year: 'numeric' };
    const result = new Intl.DateTimeFormat('id-ID', opsi).format(date);
    return result
  }
  return (
    <>
      <section className="py-10 px-5">
        <div className="bg-white rounded-xl shadow-md px-5 pt-5 pb-10">
          <div className="flex justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-700">Survei Yang Terdaftar di BNN Sleman</h1>
            </div>
            <div className="flex w-max text-sm gap-4">
              <ButtonDownload icon={<IoLink className="text-lg" />} text="Salin Link" />
              <Button icon={<LuClipboardPen className="text-xl text-biru-muda" />} color="bg-white" style="border-1 border-biru-muda/80 active:bg-slate-100" onClick={() => { }} />
            </div>
          </div>

          <div className="flex flex-col gap-5 mt-10">
            {survey.map((item) => (
              <div key={item.id} className="bg-slate-50 shadow-md rounded-xl px-5 py-3 cursor-pointer flex justify-between">
                <div>
                  <h1 className="text-md font-semibold text-gray-700">{item.title}</h1>
                  <p className="text-sm text-gray-400">{ChangeFormatDate(item.createdAt)}</p>
                </div>
                <div>
                  <KebabMenu onEdit={() => handleOpenPopupEdit(sampleData)} onDelete={() => { }} onDetail={() => handleOpenPopupDetail(sampleData)} />
                  <PopupEditForm
                    open={isPopupEditOpen}
                    onClose={() => setIsPopupEditOpen(false)}
                    formConfig={formConfig}
                    initialData={currentData}
                    onSubmit={handleSubmit}
                    title="Edit Produk"
                  />
                  <PopupDetail
                    open={isPopupDetailOpen}
                    onClose={() => setIsPopupDetailOpen(false)}
                    formConfig={formConfig}
                    data={currentData}
                    title="Detail Produk"
                    onEdit={() => handleOpenPopupEdit(sampleData)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
export default Survey