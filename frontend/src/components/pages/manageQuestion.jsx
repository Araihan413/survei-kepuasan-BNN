import ManageQuestionTable from "../Fragments/ManageQeustionTable"

const header = ["No.", "Tipe Pertanyaan", "Pertanyaan", "Admin", '']

const dataQuestion = [
  {
    id: 1,
    nama: "Biodata",
    pertanyaan: [
      {
        id: 1,
        type: "text",
        pertanyaan: "Nama",
        admin: "admin",
      },
      {
        id: 2,
        type: "text",
        pertanyaan: "Nama",
        admin: "admin",
      },
      {
        id: 3,
        type: "text",
        pertanyaan: "Nama",
        admin: "admin",
      }
    ]
  },
  {
    id: 2,
    nama: "Survei Kepuasan Pelayanan",
    pertanyaan: [
      {
        id: 1,
        type: "text",
        pertanyaan: "apakah pelayanan yang diberikan sesuai dengan kebutuhan?",
        admin: "12123"
      },
      {
        id: 2,
        type: "text",
        pertanyaan: "apakah pelayanan yang diberikan sesuai dengan kebutuhan?",
        admin: "12123"
      },
      {
        id: 3,
        type: "text",
        pertanyaan: "apakah pelayanan yang diberikan sesuai dengan kebutuhan?",
        admin: "12123"
      }
    ]
  },
  {
    id: 3,
    nama: "Survei Persepsi Anti Korupsi",
    pertanyaan: [
      {
        id: 1,
        type: "text",
        pertanyaan: "apakah pelayanan yang diberikan sesuai dengan kebutuhan?",
        admin: "12123"
      },
      {
        id: 2,
        type: "text",
        pertanyaan: "apakah pelayanan yang diberikan sesuai dengan kebutuhan?",
        admin: "12123"
      },
      {
        id: 3,
        type: "text",
        pertanyaan: "apakah pelayanan yang diberikan sesuai dengan kebutuhan?",
        admin: "12123"
      }
    ]
  },
]


const ManageQuestion = () => {
  return (
    <>
      <section className="py-10 px-5">
        <div className="bg-white rounded-xl shadow-md px-5 pt-5 pb-10">
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-700">Daftar Pertanyaan</h1>
            <p className="text-xs font-semibold text-gray-700/70">Survei Kualitas Pelayanan dan Presepsi Anti Korupsi</p>
          </div>
          <div className="mt-15 flex flex-col gap-20">
            {dataQuestion.map((survei, index) => (
              <div key={survei.id} className="w-max flex flex-col justify-center items-center">
                <div className="mb-5">
                  <h1 className="text-lg font-bold text-gray-700">{survei.nama}</h1>
                </div>
                <ManageQuestionTable width="w-[850px]" header={header} data={survei.pertanyaan} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
export default ManageQuestion