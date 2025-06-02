import CircleProgressbar from "../Elements/CircleProgressbar"
import DropdownFilter from "../Elements/DropdownFilter"
import { useState, useEffect } from "react"
import LineChart from "../Elements/LineChart"
import PaginatedTable from "../Fragments/PaginatedTable"
import { MdFilterAlt } from "react-icons/md";
import urlApi from "../../api/urlApi"

const Dashborad = () => {
  function getLastNYears(n) {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: n }, (_, i) => currentYear - i);
  }

  const [filterRespondent, setFilterRespondent] = useState({
    dateAgo: '3month',
    name: '',
    job: '',
    service: '',
    typeSurvey: ''
  })
  const [avgFilter, setAvgFilter] = useState('3month')
  const [countRespondentFilter, setCountRespondentFilter] = useState({
    year: getLastNYears(1)[0].toString(),
    query: {
      serviceId: ''
    }
  })

  const recentRespondents = async () => {
    try {
      if (!filterRespondent?.dateAgo) {
        throw new Error('dateAgo is required');
      }
      const queryParams = new URLSearchParams({
        dateAgo: filterRespondent.dateAgo,
      });
      if (filterRespondent.name) queryParams.append('name', filterRespondent.name)
      if (filterRespondent.job) queryParams.append('job', filterRespondent.job)
      if (filterRespondent.service) queryParams.append('service', filterRespondent.service)
      if (filterRespondent.typeSurvey) queryParams.append('typeSurvey', filterRespondent.typeSurvey)
      const response = await fetch(`${urlApi}/dashboard/recent-respondents?${queryParams.toString()}`)
      const dataRespondents = await response.json()
      if (!response.ok) {
        throw new Error(dataRespondents.message || dataRespondents.error);
      }
      return dataRespondents

    } catch (error) {
      console.error('Error in newestRespondent:', error.message);
      // throw error.message;
    }
  }

  const avgScore = async () => {
    try {
      const queryParams = new URLSearchParams({
        dateAgo: avgFilter
      });
      const response = await fetch(`${urlApi}/dashboard/avg-score?${queryParams.toString()}`)
      const dataAvgScore = await response.json()

      if (!response.ok) {
        throw new Error(dataAvgScore.message || dataAvgScore.error);
      }
      return dataAvgScore
    } catch (error) {
      console.error('Error in avgScore:', error.message);
      throw error.message;
    }
  }

  const countRespondent = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (countRespondentFilter.query.serviceId) queryParams.append('serviceId', countRespondentFilter.query.serviceId)
      const response = await fetch(`${urlApi}/dashboard/count-respondents/${countRespondentFilter.year}?${queryParams.toString()}`)
      const dataCount = await response.json()
      if (!response.ok) {
        throw new Error(dataCount.message || dataCount.error);
      }
      return dataCount
    } catch (error) {
      console.error('Error in countRespondent:', error.message);
      throw error.message;
    }
  }

  // ! sesuaikan data
  const [dataDiagramLine, setDataDiagramLine] = useState([])

  // ! sesuaikan data
  const [dataDiagramAvg, setDataDiagramAvg] = useState([])

  // ! sesuaikan data
  const [dataTable, setDataTable] = useState([])
  const headerTable = ["No.", "Nama", "Pekerjaan", "Layanan", "Waktu", "Jenis Survei"];

  useEffect(() => {
    const fetchDataCount = async () => {
      const dataCount = await countRespondent()
      const data = dataCount.data.map(item => ({
        x: item.month,
        y: item.count
      }))
      setDataDiagramLine([
        {
          id: 'Responden',
          color: 'hsl(205, 70%, 50%)',
          data: data
        }
      ])
    }

    const fetchDataRecent = async () => {
      const dataRecent = await recentRespondents()
      const data = dataRecent.data.map((item, index) => {
        const date = new Date(item.createdAt);
        return {
          no: index + 1,
          nama: item.name,
          pekerjaan: item.job,
          layanan: item.service.name,
          waktu: date.toLocaleString('id-ID'),
          jenisSurvei: item.typeSurvey.title
        }
      })
      setDataTable(data)
      return dataRecent
    }

    const fetchDataAvg = async () => {
      const dataAvg = await avgScore()
      const data = dataAvg.data.map(item => ({
        avgValue: item.averageScore,
        maxValue: 5,
        nameSurvey: item.title
      }))
      setDataDiagramAvg(data)
      return dataAvg
    }
    fetchDataRecent()
    fetchDataAvg()
    fetchDataCount()
  }, [filterRespondent, avgFilter, countRespondentFilter])


  const optionValue = [
    { value: 'daily', label: '1 Hari' },
    { value: 'weekly', label: '1 Minggu' },
    { value: '1month', label: '1 Bulan' },
    { value: '3month', label: '3 Bulan' },
    { value: '6month', label: '6 Bulan' },
    { value: '12month', label: '12 Bulan' },
  ]
  const optionYear = getLastNYears(3).map(year => ({ value: year.toString(), label: year.toString() }))

  const handleDropdownChangeAvg = (event) => {
    setAvgFilter(event.target.value);
    setFilterRespondent({ ...filterRespondent, dateAgo: event.target.value });
  }
  const handleDropdownChangeCount = (event) => {
    return setCountRespondentFilter({ ...countRespondentFilter, query: { serviceId: event.target.value } });
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
              <DropdownFilter value={avgFilter} options={optionValue} onChange={handleDropdownChangeAvg}></DropdownFilter>
            </div>
            <div className="flex justify-center p-5">
              {dataDiagramAvg.map((item, index) => (
                <CircleProgressbar key={index} dataSurvey={item} width={'max-w-[200px]'} sizeFont='text-sm' hiddenDownload={true} hiddenColor={true}></CircleProgressbar>
              ))}
            </div>
          </div>
          <div className="bg-white py-5 px-2 h-max rounded-xl relative shadow-lg col-span-1">
            <div className="pl-3">
              <h1 className="text-lg font-bold text-gray-700">Jumlah Responden</h1>
              <p className="text-xs font-semibold text-gray-700/70">Survei Indeks Persepsi Kualitas Pelayanan & Anti Korupsi</p>
            </div>
            <div className="absolute top-5 right-5">
              <DropdownFilter value={countRespondentFilter.query.serviceId} options={optionYear} onChange={handleDropdownChangeCount}></DropdownFilter>
            </div>
            <div>
              <LineChart data={dataDiagramLine} height={'h-[300px]'}></LineChart>
            </div>
          </div>
        </section>
        <section className="flex flex-col gap-5 w-full">
          <div className="bg-white p-5 rounded-xl shadow-lg">
            <div className="">
              <h1 className="text-lg font-bold text-gray-700">Pengisian Survei</h1>
            </div>
            <div className="overflow-x-auto">
              <PaginatedTable header={headerTable} data={dataTable}></PaginatedTable>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
export default Dashborad