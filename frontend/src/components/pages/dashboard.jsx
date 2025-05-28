import CircleProgressbar from "../Elements/CircleProgressbar"
import DropdownFilter from "../Elements/DropdownFilter"
import { useState } from "react"
import LineChart from "../Elements/LineChart"
import TableData from "../Elements/TableData"


const Dashborad = () => {
  const optionValue = [
    { value: 'daily', label: '1 Hari' },
    { value: 'weekly', label: '1 Minggu' },
    { value: '1month', label: '1 Bulan' },
    { value: '3month', label: '3 Bulan' },
    { value: '6month', label: '6 Bulan' },
    { value: '12month', label: '12 Bulan' },
  ]

  const lineData = [
    {
      id: 'Sales',
      color: 'hsl(205, 70%, 50%)',
      data: [
        { x: 'Jan', y: 50 },
        { x: 'Feb', y: 80 },
        { x: 'Mar', y: 60 },
        { x: 'Apr', y: 100 },
        { x: 'Mei', y: 97 },
        { x: 'Jun', y: 22 },
        { x: 'Jul', y: 72 },
        { x: 'Agu', y: 59 },
        { x: 'Sep', y: 87 },
        { x: 'Okt', y: 48 },
        { x: 'Nov', y: 33 },
        { x: 'Des', y: 98 },
      ],
    },
  ];
  const [selectedOption, setSelectedOption] = useState(optionValue[3].value);

  const handleDropdownChange = (event) => {
    return setSelectedOption(event.target.value);
  }


  const dataSurvey = {
    avgValue: 3.88,
    maxValue: 5,
    nameSurvey: "Indeks Persepsi Anti Korupsi (IPAK)"
  }
  return (
    <>
      <div className="py-10 px-5">
        <section className="grid grid-cols-2 gap-5 w-full pb-10 ">
          <div className="bg-white shadow-lg py-5 relative rounded-xl col-span-1">
            <div className="pl-5">
              <h1 className="text-lg font-bold text-gray-700">Hasil Analisis</h1>
              <p className="text-xs font-semibold text-gray-700/70">Survei Indeks Persepsi Kualitas Pelayanan & Anti Korupsi</p>
            </div>
            <div className="absolute top-5 right-5">
              <DropdownFilter value={selectedOption} options={optionValue} onChange={handleDropdownChange}></DropdownFilter>
            </div>
            <div className="flex justify-center p-5">
              <CircleProgressbar dataSurvey={dataSurvey} width={'max-w-[200px]'} sizeFont='text-sm' hiddenDownload={true} hiddenColor={true}></CircleProgressbar>
              <CircleProgressbar dataSurvey={dataSurvey} width={'max-w-[200px]'} sizeFont='text-sm' hiddenDownload={true} hiddenColor={true}></CircleProgressbar>
            </div>
          </div>
          <div className="bg-white py-5 px-2 h-max rounded-xl relative shadow-lg col-span-1">
            <div className="pl-3">
              <h1 className="text-lg font-bold text-gray-700">Jumlah Responden</h1>
              <p className="text-xs font-semibold text-gray-700/70">Survei Indeks Persepsi Kualitas Pelayanan & Anti Korupsi</p>
            </div>
            <div className="absolute top-5 right-5">
              <DropdownFilter value={selectedOption} options={optionValue} onChange={handleDropdownChange}></DropdownFilter>
            </div>
            <div>
              <LineChart data={lineData} height={'h-[300px]'}></LineChart>
            </div>
          </div>
        </section>
        <section className="flex flex-col gap-5">
          <div className="bg-white p-5 rounded-xl shadow-lg">
            <div className="">
              <h1 className="text-lg font-bold text-gray-700">Pengisian Survei</h1>
            </div>
            <div>
              <TableData></TableData>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
export default Dashborad