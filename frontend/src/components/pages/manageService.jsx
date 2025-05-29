import KebabMenu from "../Elements/KebabMenu"

const listLayanan = [
  {
    id: 1,
    nama: "Layanan 1",
    deskripsi: "deskripsi layanan 1",
    label: "Magang"
  },
  {
    id: 2,
    nama: "Layanan 2",
    deskripsi: "deskripsi layanan 2",
    label: "Magang"
  },
  {
    id: 3,
    nama: "Layanan 3",
    deskripsi: "deskripsi layanan 3",
    label: "Magang"
  },
  {
    id: 4,
    nama: "Layanan 4",
    deskripsi: "deskripsi layanan 4",
    label: "Magang"
  },
]

const ManageService = () => {
  return (
    <>
      <section className="py-10 px-5">
        <div className="px-5 pt-5 pb-10 flex flex-col gap-5">
          {listLayanan.map((layanan, index) => (
            <div className="flex justify-between px-5 py-3 bg-white shadow-mv rounded-xl cursor-pointer">
              <div>
                <h1 className="text-lg font-bold text-gray-700">{layanan.nama}</h1>
                <p className="text-xs font-normal text-gray-700/70">{layanan.deskripsi}</p>
              </div>
              <KebabMenu onEdit={() => { }} onDelete={() => { }} onDetail={() => { }} />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
export default ManageService