import KebabMenu from "../Elements/KebabMenu"
import urlApi from "../../api/urlApi"
import { useState, useEffect } from "react"
import { FaCirclePlus } from "react-icons/fa6";
import { PopupCreateService } from "../Fragments/PopupAdd";
import PopupEdit from "../Fragments/PopupEdit";
import PopupDetail from "../Fragments/PopupDetail";
import { AlertFailed, AlertSuccess } from "../Elements/Alert";


const ManageService = () => {
  const [listService, setListService] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopupAddService, setShowPopupAddService] = useState(false);
  const [showPopupEdit, setShowPopupEdit] = useState(false);
  const [showPopupDetail, setShowPopupDetail] = useState(false);
  const [dataDetailService, setDataDetailService] = useState({});


  const layoutDataService = [
    { key: "name", label: "Nama layanan", type: "text", accessEdit: true, validation: { required: 'Nama layanan wajib diisi' } },
    { key: "description", label: "Deskripsi", type: "textArea", accessEdit: true, validation: {} },
    {
      key: "label", label: "Label layanan", type: "text", accessEdit: true, validation: {
        required: 'Label layanan wajib diisi', maxLength: {
          value: 20,
          message: 'label tidak boleh lebih dari 20 karakter'
        }
      }
    },
  ]

  const fetchDataService = async () => {
    try {
      const response = await fetch(`${urlApi}/service`);
      if (!response.ok) throw new Error(response.error);
      const data = await response.json();
      setListService(data.data);
    } catch (error) {
      AlertFailed({ text: error.message });
    }
  };

  useEffect(() => {
    fetchDataService();
  }, [])


  const handleAddService = () => {
    setShowPopupAddService(true);
  }

  const handleOpenPopupEdit = (id) => {
    const service = listService.find(service => service.serviceId === id);
    setDataDetailService({
      id: service.serviceId,
      name: service.name,
      label: service.label,
      description: service.description
    });
    setShowPopupEdit(true);
  }
  const handleOpenPopupDetail = (id) => {
    const service = listService.find(service => service.serviceId === id);
    setDataDetailService({
      id: service.serviceId,
      name: service.name,
      label: service.label,
      description: service.description
    });
    setShowPopupDetail(true);
  }

  const handleToPopupEdit = () => {
    setShowPopupDetail(false);
    setShowPopupEdit(true);
  }

  const handleUpdateService = (updatedData) => {
    const fetchData = async (id) => {
      try {
        const response = await fetch(`${urlApi}/service/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: updatedData.name,
            label: updatedData.label,
            description: updatedData.description,
          }),
        });
        const newData = await response.json();
        if (!response.ok) {
          throw new Error(newData.message || newData.error);
        }
        fetchDataService();
        AlertSuccess({ text: 'Data berhasil diedit!' });
      } catch (error) {
        AlertFailed({ text: error.message });
      }
    };
    fetchData(updatedData.id);

  }

  const handleCreatedService = () => {
    fetchDataService();
  }

  const handleDeleteService = (id) => {
    const fetchData = async (id) => {
      try {
        const response = await fetch(`${urlApi}/service/${id}`, {
          method: "DELETE",
        });
        const newData = await response.json();
        if (!response.ok) {
          throw new Error(newData.message || newData.error);
        }
        fetchDataService();
        AlertSuccess({ text: 'Data berhasil dihapus!' });
      } catch (error) {
        AlertFailed({ text: error.message });
      }
    };
    fetchData(id);
  }

  return (
    <>
      <section className="py-10 px-5">
        <div className="px-5 pt-5 pb-21 flex flex-col gap-5 bg-white rounded-xl relative">
          <div className="text-start mb-5">
            <h1 className="text-lg font-bold text-gray-700">Daftar Layanan</h1>
          </div>
          {listService.map((service, index) => (
            <div key={index} className="flex justify-between px-5 py-3 bg-slate-50 shadow-md rounded-xl cursor-pointer">
              <div>
                <h1 className="text-md font-semibold text-gray-700 mb-1">{service.name}</h1>
                <p className="text-xs text-gray-400">{service.label}</p>
              </div>
              <KebabMenu onEdit={() => handleOpenPopupEdit(service.serviceId)} onDelete={() => { handleDeleteService(service.serviceId) }} onDetail={() => { handleOpenPopupDetail(service.serviceId) }} />
            </div>
          ))}
        </div>
        <div>
          <button type="button" className="text-biru-muda active:text-biru-muda/80 active:scale-95 cursor-pointer fixed bottom-14 right-9 text-5xl" onClick={handleAddService}>
            <FaCirclePlus />
          </button>
          <PopupCreateService open={showPopupAddService} handleCancel={() => setShowPopupAddService(false)} onSuccessAdd={handleCreatedService} />
        </div>
        {/* ? popup */}
        <PopupEdit
          dataPopup={dataDetailService}
          open={showPopupEdit}
          handleClose={() => setShowPopupEdit(false)}
          layoutForm={layoutDataService}
          onSubmitSuccess={handleUpdateService}
        />
        <PopupDetail
          open={showPopupDetail}
          handleClose={() => setShowPopupDetail(false)}
          dataPopup={dataDetailService}
          layoutForm={layoutDataService}
          handleToPopupEdit={handleToPopupEdit}
        />
      </section>
    </>
  )
}
export default ManageService