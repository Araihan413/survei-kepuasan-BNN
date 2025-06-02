import DropdownFilter from "../Elements/DropdownFilter"
import { useState, useRef, useEffect } from "react"
import CircleProgressbar from "../Elements/CircleProgressbar"
import PieChart from "../Elements/PieChart"
import ButtonDownload from "../Elements/ButtonDownload"
import html2canvas from "html2canvas";
import { MdOutlineFileDownload } from "react-icons/md";
import RankingTable from "../Fragments/RangkingTable"
import ResponsesTable from "../Fragments/ResponsesTable"
import BarChartHorizontal from "../Elements/BarChartHorizontal"
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import urlApi from "../../api/urlApi"
import { useNavigate, useSearchParams } from 'react-router-dom';

const Analysis = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const surveyId = searchParams.get('id');
  const ref = useRef(null);

  // ? data untuk option filter berdasarkan waktu
  const optionFilterValue = [
    { value: 'daily', label: '1 Hari' },
    { value: 'weekly', label: '1 Minggu' },
    { value: '1month', label: '1 Bulan' },
    { value: '3month', label: '3 Bulan' },
    { value: '6month', label: '6 Bulan' },
    { value: '12month', label: '12 Bulan' },
  ]
  // ? data untuk menetukan jumlah pilihan survey
  const dataListSurvey = [];
  const [surveyActive, setSurveiActive] = useState(dataListSurvey[0].id)
  const [selectedFilter, setSelectedFilter] = useState(optionFilterValue[3].value);
  const downloadImage = () => {
    html2canvas(ref.current, { backgroundColor: null }).then(canvas => {
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "diagram.png";
      a.click();
    });
  };

  const listSurvey = async () => {
    try {
      const response = await fetch(`${urlApi}/survey`);
      if (!response.ok) throw new Error('Gagal mengambil data survey');
      const dataSurvey = await response.json();
      return dataSurvey?.data || [];
    } catch (error) {
      console.error(error);
      throw error.message;
    }
  }


  const analysisSurvey = async (id, date) => {
    try {
      const response = await fetch(`${urlApi}/analysis/survey/${id}?date=${date}`);
      const dataAnalysis = await response.json();
      if (!response.ok) throw new Error(dataAnalysis.message || dataAnalysis.error);
      return dataAnalysis;
    } catch (error) {
      console.error(error);
      throw error.message;
    }
  }

  const [dataAvgSurvey, setDataAvgSurvey] = useState({});
  // ? data untuk diagram rata rata

  // ? data untuk pie chart
  const [dataPieChart, setDataPieChart] = useState([]);
  const colorPieChart = ['#00FFDE', '#CA7842', '#3eb8ff', '#ffaf3e', '#7eec08', '#08eca6', '#8108ec', '#FF90BB', '#A4B465', '#FFDBDB', '#FE7743', '#E9F5BE', '#7AE2CF', '#547792', '#328E6E',]
  // const dataPieChartr = [
  //   {
  //     namaChart: "Usia",
  //     data: [{
  //       color: '#3eb8ff',
  //       id: 'java',
  //       value: 578
  //     },
  //     {
  //       color: '#ffaf3e',
  //       id: 'haskell',
  //       value: 250
  //     },
  //     {
  //       color: '#7eec08',
  //       id: 'sosialisasi P4GN',
  //       value: 503
  //     },
  //     {
  //       color: '#08eca6',
  //       id: 'Mahasiswa/Pelajar',
  //       value: 449
  //     },
  //     {
  //       color: '#8108ec',
  //       id: 'python',
  //       value: 276
  //     }]
  //   },
  //   {
  //     namaChart: "Usia",
  //     data: [{
  //       color: '#3eb8ff',
  //       id: 'java',
  //       value: 578
  //     },
  //     {
  //       color: '#ffaf3e',
  //       id: 'haskell',
  //       value: 250
  //     },
  //     {
  //       color: '#7eec08',
  //       id: 'sosialisasi P4GN',
  //       value: 503
  //     },
  //     {
  //       color: '#08eca6',
  //       id: 'Mahasiswa/Pelajar',
  //       value: 449
  //     },
  //     {
  //       color: '#8108ec',
  //       id: 'python',
  //       value: 276
  //     },]
  //   },
  //   {
  //     namaChart: "Usia",
  //     data: [{
  //       color: '#3eb8ff',
  //       id: 'java',
  //       value: 578
  //     },
  //     {
  //       color: '#ffaf3e',
  //       id: 'haskell',
  //       value: 250
  //     },
  //     {
  //       color: '#7eec08',
  //       id: 'sosialisasi P4GN',
  //       value: 503
  //     },
  //     {
  //       color: '#08eca6',
  //       id: 'Mahasiswa/Pelajar',
  //       value: 449
  //     },
  //     {
  //       color: '#8108ec',
  //       id: 'python',
  //       value: 276
  //     },]
  //   },
  //   {
  //     namaChart: "Usia",
  //     data: [{
  //       color: '#3eb8ff',
  //       id: 'java',
  //       value: 578
  //     },
  //     {
  //       color: '#ffaf3e',
  //       id: 'haskell',
  //       value: 250
  //     },
  //     {
  //       color: '#7eec08',
  //       id: 'sosialisasi P4GN',
  //       value: 503
  //     },
  //     {
  //       color: '#08eca6',
  //       id: 'Mahasiswa/Pelajar',
  //       value: 449
  //     },
  //     {
  //       color: '#8108ec',
  //       id: 'python',
  //       value: 276
  //     },]
  //   },
  // ];

  // ? data untuk table ranking pertanyaa

  const [dataTableRanking, setDataTableRanking] = useState({});
  const tableRanking = {
    dataAnalisis: {
      id: 1,
      name: 'Survei Presepsi Kualitas Pelayanan',
      pertanyaan: [
        {
          id: 1,
          pertanyaan: "Bagaimana pendapat anda tentang layanan pelayanan di P4GN?",
          nilai: [
            { id: 1, nilai: 4, jumlah: 100 },
            { id: 2, nilai: 3, jumlah: 20 },
            { id: 3, nilai: 2, jumlah: 4 },
            { id: 4, nilai: 1, jumlah: 1 }
          ],
          ranking: 2,
          avg: 3.45
        },
        {
          id: 2,
          pertanyaan: "Bagaimana pendapat anda teknologi pada saat ini?",
          nilai: [
            { id: 1, nilai: 4, jumlah: 69 },
            { id: 2, nilai: 3, jumlah: 12 },
            { id: 3, nilai: 2, jumlah: 4 },
            { id: 4, nilai: 1, jumlah: 0 }
          ],
          ranking: 2,
          avg: 3.45
        },
      ]
    }
  }

  // ? data untuk table pertanyaan text
  const tablePertanyaanText = {
    dataAnalisis: {
      id: 1,
      name: 'Survei Presepsi Kualitas Pelayanan',
      countRespondent: 3,
      pertanyaan: [
        {
          id: 1,
          pertanyaan: "Bagaimana pendapat anda tentang layanan pelayanan di P4GN?",
          text: [
            "aku kurang enak ketika jshdas",
            "kurang jelas atas pelayanan nya",
            "nunggu nya sejam njir lah"
          ],
        },
        {
          id: 2,
          pertanyaan: "Bagaimana pendapat anda tentang layanan pelayanan di P4GN?",
          text: [
            "tidak",
            "-",
            "aks"
          ],
        },
        {
          id: 3,
          pertanyaan: "Bagaimana pendapat anda tentang layanan pelayanan di P4GN?",
          text: [
            "tidak",
            "-",
            "aks"
          ],
        },
        {
          id: 4,
          pertanyaan: "Bagaimana pendapat anda tentang layanan pelayanan di P4GN?",
          text: [
            "tidak",
            "-",
            "aks"
          ],
        },
      ]
    }
  }

  useEffect(() => {
    const fetchDataListSurvey = async () => {
      try {
        const dataSurvey = await listSurvey();
        dataListSurvey.push(...dataSurvey);
      } catch (error) {
        console.error(error);
      }
    }
    const fetchDataAnalysisSurvey = async () => {
      try {
        const dataAnalysis = await analysisSurvey(surveyId, selectedFilter);
        setDataAvgSurvey({
          avgValue: dataAnalysis.averageScore,
          maxValue: 5,
          nameSurvey: dataAnalysis.surveyTitle
        })

        const chartLabelMap = {
          ageGroups: "Usia",
          genders: "Jenis Kelamin",
          services: "Layanan",
          jobs: "Pekerjaan"
        };
        // Konversi menjadi array pie chart
        let colorIndex = 0;

        const getNextColor = (colors) => {
          const color = colors[colorIndex % colors.length];
          colorIndex++;
          return color;
        };

        const dataPieChartr = Object.entries(rawData.distribution).map(([key, value]) => ({
          namaChart: chartLabelMap[key] || key,
          data: Object.entries(value).map(([label, count]) => ({
            id: label,
            value: count,
            color: getNextColor(colorPieChart),
          }))
        }));

        setDataPieChart(dataPieChartr);

        dataAnalysis.distribution.map((item, index) => {

        })
      } catch (error) {
        console.error(error);
      }
    }
  }, [surveyId, selectedFilter])

  // ? unduh data ke dalam excel
  // ? data yang masuk harus berupa array of objects
  const exportExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data); // Mengubah data JSON ke worksheet
    const workbook = XLSX.utils.book_new(); // Membuat workbook baru
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data"); // Menambahkan worksheet ke workbook

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" }); // Konversi workbook ke array
    const file = new Blob([excelBuffer], { type: "application/octet-stream" }); // Membuat Blob

    saveAs(file, `${fileName}.xlsx`); // Mengunduh file
  };

  const headerPertanyaanText = () => {
    const header = ['No.']
    tablePertanyaanText.dataAnalisis.pertanyaan.map((item) => header.push(item.pertanyaan))
    return header
  }
  // ? dataHeader untuk table ranking pertanyaan
  const dataHeaderRanking = ["No", "Pertanyaan", "4", "3", "2", "1", "Rata-Rata", "Ranking"];

  // ? data untuk table bar horizontal

  const dataBarHorizontal = [
    {
      label: 'Ya',
      value: 25,
    },
    {
      label: 'Tidak',
      value: 15,
    },
  ];


  const handleDropdownChange = (event) => {
    return setSelectedFilter(event.target.value);
  }

  const handleChangeSurvey = (id) => {
    navigate(`/analisis?id=${id}`);
    setSurveiActive(id);
  }
  return (
    <>
      <section className="py-10 px-5">
        <div className="relative bg-white rounded-xl shadow-md px-5 pt-5 pb-10">

          <div>
            <h1 className="text-lg font-bold text-gray-700">Hasil Analisis</h1>
            <p className="text-xs font-semibold text-gray-700/70">Survei Indeks Persepsi Kualitas Pelayanan & Anti Korupsi</p>
          </div>

          <div className="absolute top-5 right-5">
            <DropdownFilter value={selectedFilter} options={optionFilterValue} onChange={handleDropdownChange}></DropdownFilter>
          </div>

          <div className="flex flex-wrap justify-center gap-5 mt-8">
            {dataListSurvey.map((pelayanan) => (
              <div className="mt-5" key={pelayanan.id} onClick={() => handleChangeSurvey(pelayanan.id)}>
                <h1 className={`text-sm border-2 text-center border-biru-tua shadow-md w-max cursor-pointer py-3 min-w-[250px] rounded-2xl ${surveyId === pelayanan.id ? 'bg-biru-tua text-white font-semibold' : ' font-normal bg-white text-gray-700'}`}>{pelayanan.name}</h1>
              </div>
            ))}
          </div>

          <div className="mt-20 flex justify-center">
            <CircleProgressbar dataSurvey={dataAvgSurvey} width={'max-w-[280px]'} sizeFont='text-lg'></CircleProgressbar>
          </div>

          <div className="flex flex-wrap justify-center gap-10 items-center mt-10">
            {dataPieChart.map((chart, index) => (
              <div className="bg-white relative rounded-md border-[1px] border-gray-700/60" key={index}>
                <div className="absolute top-5 right-5">
                  < ButtonDownload color="bg-white" icon={<MdOutlineFileDownload />} onClick={downloadImage} />
                </div>
                <div className="px-5 pt-2 pb-2 border-b-[1px] border-gray-700/60">
                  <h1 className="text-base font-bold text-gray-700 mb-1">{chart.namaChart}</h1>
                  <span className="text-xs inline-block h-max text-gray-700 px-2 py-0.5 border-1 border-gray-700/60 rounded-sm bg-white">{optionFilterValue.find(item => item.value === selectedFilter).label || '-'}</span>
                </div>
                <div ref={ref} className="p-5">
                  <h1 className="text-base text-center font-bold mb-1">{chart.namaChart.toUpperCase()}</h1>
                  <PieChart data={chart.data} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 relative w-max">
            <div className="text-center mb-20">
              <h1 className="text-lg font-bold text-gray-700">Analisis Jawaban Hasil {dataListSurvey.find(item => item.id === setSurveiActive).name || '-'}</h1>
            </div>
            <div className="flex gap-2 absolute top-15 right-0">
              <span className="text-xs font-semibold inline-block h-max text-white px-5 py-2 border-1  rounded-xl bg-biru-gelap">{optionFilterValue.find(item => item.value === selectedFilter).label || '-'}</span>
              < ButtonDownload color="bg-white" icon={<MdOutlineFileDownload className="text-lg" />} onClick={downloadImage} text="Unduh" style="text-xs px-4" />
            </div>
            <RankingTable data={tableRanking} header={dataHeaderRanking} width="w-[850px]"></RankingTable>
          </div>

          <div className="mt-20 pt-15 relative flex justify-center w-max">
            <div className="flex gap-2 absolute top-3 right-0">
              <span className="text-xs font-semibold inline-block h-max text-white px-5 py-2 border-1  rounded-xl bg-biru-gelap">{optionFilterValue.find(item => item.value === selectedFilter).label || '-'}</span>
              < ButtonDownload color="bg-white" icon={<MdOutlineFileDownload className="text-lg" />} onClick={downloadImage} text="Unduh" style="text-xs px-4" />
            </div>
            <ResponsesTable data={tablePertanyaanText} header={headerPertanyaanText()} width="w-[850px]" />
          </div>

          <div className="mt-20 pt-15 relative w-max">
            <div className="flex gap-2 absolute top-3 right-0">
              <span className="text-xs font-semibold inline-block h-max text-white px-5 py-2 border-1  rounded-xl bg-biru-gelap">{optionFilterValue.find(item => item.value === selectedFilter).label || '-'}</span>
              < ButtonDownload color="bg-white" icon={<MdOutlineFileDownload className="text-lg" />} onClick={downloadImage} text="Unduh" style="text-xs px-4" />
            </div>
            <div className="border-1 border-gray-700/60 rounded-xl py-5 shadow-md">
              <div className="pl-5">
                <h1 className="text-md font-semibold text-gray-700">Bagaimana pendapat anda tentang layanan pelayanan di P4GN?</h1>
              </div>
              <BarChartHorizontal data={dataBarHorizontal} height="h-[200px]" width="w-[850px]" />
            </div>
          </div>
        </div>
      </section >
    </>
  )
}
export default Analysis