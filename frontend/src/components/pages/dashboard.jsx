import CircleProgressbar from "../Elements/CircleProgressbar"
import DropdownFilter from "../Elements/DropdownFilter"
import { useState, useEffect, useCallback } from "react"
import LineChart from "../Elements/LineChart"
import PaginatedTable from "../Fragments/PaginatedTable"
import { MdFilterAlt } from "react-icons/md";
import urlApi from "../../api/urlApi"
import Button from "../Elements/Button"
import PopupFilterRespondent from "../Fragments/PopupFilterRespondent"
import { AlertFailed } from "../Elements/Alert"
import { useOutletContext } from 'react-router-dom';

const Dashborad = () => {

  function getLastNYears(n) {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: n }, (_, i) => currentYear - i);
  }

  const [avgFilter, setAvgFilter] = useState('3month')
  const [filterRespondent, setFilterRespondent] = useState({
    dateAgo: '3month',
    job: '',
    serviceId: '',
    surveyId: ''
  })
  const [countRespondentFilter, setCountRespondentFilter] = useState({
    year: getLastNYears(1)[0].toString(),
    query: {
      label: "",
      serviceId: ""
    }
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [listService, setListService] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const { socket } = useOutletContext();

  const refreshDashboardData = useCallback(async () => {
    console.log("Refreshing dashboard data...");
    try {
      await Promise.all([
        recentRespondents(filterRespondent),
        avgScore(),
        countRespondent(countRespondentFilter),
      ]);
    } catch (error) {
      console.error("Failed to refresh data:", error);
      AlertFailed({ text: "Gagal memuat data terbaru" });
    } finally {
    }
  }, [socket]);

  const recentRespondents = async (filter) => {
    try {
      if (!filter?.dateAgo) {
        throw new Error('query dateAgo dibutuhkan');
      }
      const queryParams = new URLSearchParams({
        dateAgo: filter.dateAgo,
      });
      if (filter.job) queryParams.append('job', filter.job)
      if (filter.serviceId) queryParams.append('serviceId', filter.serviceId)
      if (filter.surveyId) queryParams.append('surveyId', filter.surveyId)
      const response = await fetch(`${urlApi}/dashboard/recent-respondents?${queryParams.toString()}`)
      const dataRespondents = await response.json()
      if (!response.ok) {
        throw new Error(dataRespondents.message || dataRespondents.error);
      }
      const data = dataRespondents.data.map((item, index) => {
        const date = new Date(item.createdAt);
        const tanggal = date.getDate().toString().padStart(2, '0');
        const bulan = (date.getMonth() + 1).toString().padStart(2, '0');
        const tahun = date.getFullYear();
        const jam = date.getHours().toString().padStart(2, '0');
        const menit = date.getMinutes().toString().padStart(2, '0');

        const dateString = `${tanggal}-${bulan}-${tahun} ${jam}:${menit}`;
        return {
          no: index + 1,
          nama: item.name,
          pekerjaan: item.job,
          layanan: item.service.name,
          waktu: dateString,
          jenisSurvei: item.survey.title
        }
      })
      setDataTable(data)

    } catch (error) {
      setError(error.message);
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
      const data = dataAvgScore.data.map(item => ({
        id: item.survey_id,
        avgValue: item.averageScore ?? 0,
        maxValue: 5,
        nameSurvey: item.title ?? "-"
      }))
      setDataDiagramAvg(data)
    } catch (error) {
      setError(error.message);
    }
  }

  const countRespondent = async (filter) => {
    try {
      const queryParams = new URLSearchParams();
      if (filter.query.serviceId) queryParams.append('serviceId', filter.query.serviceId)
      const response = await fetch(`${urlApi}/dashboard/count-respondents/${filter.year}?${queryParams.toString()}`)
      const dataCount = await response.json()
      if (!response.ok) {
        throw new Error(dataCount.message || dataCount.error);
      }
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const data = dataCount.data.map((item) => ({
        x: monthNames[Number(item.month.split('-')[1]) - 1],
        y: item.count
      }))
      setDataDiagramLine([
        {
          id: 'Responden',
          color: 'hsl(205, 70%, 50%)',
          data: data
        }
      ])
      return dataCount.data
    } catch (error) {
      setError(error.message);
    }
  }

  // ! data line diagram
  const [dataDiagramLine, setDataDiagramLine] = useState([])

  // ! data bar diagram
  const [dataDiagramAvg, setDataDiagramAvg] = useState([])

  // ! data table respondent
  const [dataTable, setDataTable] = useState([])
  const headerTable = ["No.", "Nama", "Pekerjaan", "Layanan", "Waktu", "Jenis Survei"];

  useEffect(() => {

    const fetchData = async () => {
      await Promise.all([
        recentRespondents(filterRespondent),
        avgScore(),
        countRespondent(countRespondentFilter)
      ])
    }

    fetchData()
  }, [filterRespondent, avgFilter, countRespondentFilter])

  useEffect(() => {
    const fetchDataSevice = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${urlApi}/service`)
        const dataServices = await response.json()
        if (!response.ok) {
          throw new Error(dataServices.message || dataServices.error);
        }
        const service = dataServices.data.map(item => ({ value: item.serviceId, label: item.label }))
        const optionService = [{ value: "", label: 'Semua Layanan' }, ...service]
        setListService(optionService)

      } catch (error) {
        setError(error.message);
      } finally {

        setLoading(false)
      }
    }
    fetchDataSevice()

  }, [])

  // Setup WebSocket listeners
  useEffect(() => {
    const onConnect = () => {
      console.log("WebSocket connected");
      setIsSocketConnected(true);
      socket.emit('register-admin');
    };

    const onNewSurvey = (data) => {
      refreshDashboardData();
    };

    // Connect handlers
    socket.on('connect', onConnect);
    socket.on('new-survey', onNewSurvey);

    // Initialize connection
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('new-survey', onNewSurvey);
    };
  }, [refreshDashboardData]);

  // ? option untuk filter periode
  const optionValue = [
    { value: 'daily', label: '1 Hari' },
    { value: 'weekly', label: '1 Minggu' },
    { value: '1month', label: '1 Bulan' },
    { value: '3month', label: '3 Bulan' },
    { value: '6month', label: '6 Bulan' },
    { value: '12month', label: '12 Bulan' },
  ]
  // ? option untuk filter tahun
  const optionYear = getLastNYears(3).map(year => ({ value: year.toString(), label: year.toString() }))

  // ? option untuk filter layanan

  const handleChangePeriod = (event) => {
    setAvgFilter(event.target.value);
    setFilterRespondent(prev => ({ ...prev, dateAgo: event.target.value }));
  }

  const handleChangeYear = (event) => {
    return setCountRespondentFilter(prev => ({ ...prev, year: event.target.value }));
  }

  const handleChangeService = (event) => {
    const value = event.target?.value;
    const label = event.target?.label;
    return setCountRespondentFilter(prev => ({ ...prev, query: { ...prev.query, label: label, serviceId: parseInt(value) } }));
  }

  const closePopupFilter = () => {
    setShowPopup(false);
  }

  const handleApplyFilter = (data) => {
    setFilterRespondent(prev => ({ ...prev, job: data.job, serviceId: data.serviceId, surveyId: data.surveyId }));
    setShowPopup(false);
  };

  if (loading) return <div className="h-full w-full flex justify-center items-center text-biru-muda">Loading data dashboard...</div>;

  return (
    <>
      <div className="py-5 px-5">
        <section className="grid grid-cols-2 gap-5 w-full pb-5 ">
          <div className="bg-white shadow-lg py-5 relative rounded-xl col-span-1">
            <div className="pl-5 mb-8">
              <h1 className="text-lg font-bold text-gray-700">Hasil Analisis</h1>
              <p className="text-xs font-semibold text-gray-700/70">Survei Indeks Persepsi Kualitas Pelayanan & Anti Korupsi</p>
            </div>
            <div className="absolute top-20 right-5">
              <DropdownFilter value={avgFilter} options={optionValue} onChange={handleChangePeriod}></DropdownFilter>
            </div>
            <div className="flex justify-center gap-2 p-5">
              {dataDiagramAvg.length > 0 ? (
                dataDiagramAvg.map((item, index) => (
                  <CircleProgressbar key={index} dataSurvey={item} width={'max-w-[200px]'} sizeFont='text-sm' hiddenDownload={true} hiddenColor={true}>
                  </CircleProgressbar>
                ))
              )
                : (
                  <div className="text-center">
                    <p className="text-sm text-gray-700">Tidak ada data</p>
                  </div>
                )
              }
            </div>
          </div>
          <div className="bg-white py-5 px-2 h-max rounded-xl relative shadow-lg col-span-1">
            <div className="pl-3 mb-8">
              <h1 className="text-lg font-bold text-gray-700">Jumlah Responden</h1>
              <p className="text-xs font-semibold text-gray-700/70">Survei Indeks Persepsi Kualitas Pelayanan & Anti Korupsi</p>
            </div>
            <div className="absolute top-20 right-5 flex gap-2">
              <div>
                <DropdownFilter value={countRespondentFilter.query.label} options={listService} onChange={handleChangeService}></DropdownFilter>
              </div>
              <div>
                <DropdownFilter value={countRespondentFilter.year} options={optionYear} onChange={handleChangeYear}></DropdownFilter>
              </div>
            </div>
            <div>
              <LineChart data={dataDiagramLine} height={'h-[300px]'}></LineChart>
            </div>
          </div>
        </section>
        <section className="flex w-full">
          <div className="bg-white p-5 rounded-xl shadow-lg w-full">
            <div className="flex justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-700">Pengisian Survei</h1>
              </div>
              <div>
                <Button icon={<MdFilterAlt className="text-lg"></MdFilterAlt>} text="Filter" onClick={() => setShowPopup(true)} color="bg-white" style="w-max text-sky-400"></Button>
                <div>
                  <PopupFilterRespondent open={showPopup} onClose={closePopupFilter} onApplyFilter={handleApplyFilter} />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto ">
              <PaginatedTable header={headerTable} data={dataTable} ></PaginatedTable>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
export default Dashborad
