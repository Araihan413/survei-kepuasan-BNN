import DropdownFilter from "../Elements/DropdownFilter"
import { useState, useRef, useEffect, useCallback } from "react"
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
import { useOutletContext } from 'react-router-dom';

const Analysis = () => {
  const chartRefs = useRef({
    pie: [],
    bar: [],
  });

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
  const [dataListSurveyActive, setDataListSurveyActive] = useState([]);
  const [surveyActive, setSurveyActive] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(optionFilterValue[3].value);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataDiagramAvg, setDataDiagramAvg] = useState([]);
  const [dataPieChart, setDataPieChart] = useState([]);
  const [dataTableRanking, setDataTableRanking] = useState({});
  const [dataQuestionTableText, setDataQuestionTableText] = useState({});
  const [dataQuestionOpsi, setDataQuestionOpsi] = useState([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const { socket } = useOutletContext();

  const headerPertanyaanText = () => {
    const header = ['No.']
    dataQuestionTableText.dataSurvei.analisis.forEach((item) => header.push(item.pertanyaan))
    return header
  }

  // ? dataHeader untuk table ranking pertanyaan
  const dataHeaderRanking = ["No", "Pertanyaan", "4", "3", "2", "1", "Rata-Rata", "Ranking"];

  const pieChartColors = [
    '#4E79A7', // biru
    '#F28E2B', // oranye
    '#E15759', // merah lembut
    '#76B7B2', // hijau kebiruan
    '#59A14F', // hijau
    '#EDC949', // kuning
    '#AF7AA1', // ungu
    '#FF9DA7', // pink lembut
    '#9C755F', // coklat lembut
    '#BAB0AC', // abu-abu netral
    '#D37295', // pink-ungu
    '#FABFD2', // pink pastel
    '#B07AA1', // ungu gelap
    '#86BCB6', // hijau pastel
    '#FFA07A'  // salmon
  ];

  const chartLabelMap = {
    ageGroups: "Usia",
    genders: "Jenis Kelamin",
    services: "Layanan",
    jobs: "Pekerjaan"
  };

  // ? untuk mengambil semua option pada suatu pertanyaan
  const listOption = async (questionId) => {
    try {
      const response = await fetch(`${urlApi}/option/${questionId}`);
      const dataOption = await response.json();

      if (!response.ok) throw new Error(dataOption.message || dataOption.error);

      return dataOption.data.map(item => item.optionText);
    } catch (err) {
      setError(err.message);
      return [];
    }
  };


  // Reset refs sebelum render (untuk menghindari akumulasi ref lama)
  chartRefs.current.pie = [];
  chartRefs.current.bar = [];
  const downloadImage = (type, index) => {
    const el = chartRefs.current[type]?.[index];
    if (!el) return;

    html2canvas(el, { backgroundColor: null }).then((canvas) => {
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `${type}_chart_${index + 1}.png`;
      a.click();
    });
  };

  const convertDistributionToChart = (distribution) => {
    let colorIndex = 0;

    const getNextColor = () => {
      const color = pieChartColors[colorIndex % pieChartColors.length];
      colorIndex++;
      return color;
    };

    return Object.entries(distribution).map(([key, valueObj]) => {
      const dataArray = Object.entries(valueObj).map(([label, count]) => ({
        id: label,
        value: count,
        color: getNextColor()
      }));

      return {
        namaChart: chartLabelMap[key] || key,
        data: dataArray
      };
    });
  };

  const convertDataToTableRanking = (dataTable, idSurvey, namaSurvey) => {
    const tableRanking = {
      dataSurvei: {
        id: idSurvey,
        nama: namaSurvey,
        analisis: dataTable.map((item, index) => ({
          id: item.id,
          pertanyaan: item.questionText,
          nilai: Object.entries(item.ratings)
            .sort((a, b) => parseInt(b[0]) - parseInt(a[0])) // Urutkan dari nilai terbesar ke terkecil
            .map(([key, value]) => ({
              id: parseInt(key),
              nilai: parseInt(key),
              jumlah: value
            })),
          ranking: item.ranking,
          avg: item.avgAnswer
        }))
      }
    };
    return tableRanking
  }
  const convertTextAnalysis = (rawData, idSurvey, titleSurvey) => {
    return {
      dataSurvei: {
        id: idSurvey,
        title: titleSurvey,
        jumlahResponden: rawData.length > 0 ? rawData[0].countRespondent : 0,
        analisis: rawData.map((item, index) => ({
          id: index + 1,
          pertanyaan: item.questionText,
          text: item.responsesText
        }))
      }
    };
  };

  const convertOpsiAnalysis = async (rawData) => {
    const masterOptions = await Promise.all(rawData.map(item => listOption(item.id)));
    const result = rawData.map((ques, index) => {
      const formatted = masterOptions[index].map(opt => {
        const label = opt.charAt(0).toUpperCase() + opt.slice(1).toLowerCase();
        const value = ques.responsesOption[label] ?? 0;
        return { label, value };
      });

      return {
        ...ques,
        responsesOption: formatted
      };
    });
    return result

  };

  // 🔹 Ambil daftar survey (kecuali 'Biodata')
  const listSurvey = async () => {
    try {
      const response = await fetch(`${urlApi}/survey`);
      const dataSurvey = await response.json();
      if (!response.ok) throw new Error(dataSurvey.message || dataSurvey.error);

      const filtered = dataSurvey.data.filter(item => item.isPersonal === false && item.isPublished === true);
      setDataListSurveyActive(filtered);
      return filtered;
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  // 🔹 Analisis satu survey berdasarkan ID dan range tanggal
  const analysisSurvey = async (id, date) => {
    try {
      const response = await fetch(`${urlApi}/analysis/${id}?rangeDate=${date}`);
      const dataAnalysis = await response.json();

      if (!response.ok) throw new Error(dataAnalysis.message || dataAnalysis.error);

      const resultData = dataAnalysis.data;

      // Cek apakah data kosong/null
      if (!resultData || Object.keys(resultData).length === 0) {
        throw new Error("Data survei tidak tersedia untuk range waktu tersebut.");
      }

      //? Set diagram rata-rata
      setDataDiagramAvg({
        id: id,
        avgValue: resultData.averageScore ?? 0,
        maxValue: 5,
        nameSurvey: resultData.surveyTitle ?? "-"
      });

      // ? Pie chart distribusi (misalnya usia, gender, dst)
      const dataPieChart = convertDistributionToChart(resultData.distribution ?? {});
      setDataPieChart(dataPieChart);

      //? Tabel pertanyaan skala
      const dataTableRanking = convertDataToTableRanking(
        resultData.questionScaleAnalysis ?? [],
        id,
        resultData.surveyTitle ?? "-"
      );
      setDataTableRanking(dataTableRanking);

      //? Tabel pertanyaan teks
      if (resultData.questionTextAnalysis?.length > 0) {
        const dataQuestionTableText = convertTextAnalysis(
          resultData.questionTextAnalysis,
          id,
          resultData.surveyTitle ?? "-"
        );
        setDataQuestionTableText(dataQuestionTableText);
      } else {
        setDataQuestionTableText({});
      }

      //? Tabel pertanyaan opsi
      const processOptionData = async () => {
        if (resultData.questionOptionAnalysis?.length > 0) {
          const dataQuestionOpsi = await convertOpsiAnalysis(resultData.questionOptionAnalysis);
          setDataQuestionOpsi(dataQuestionOpsi);
        } else {
          setDataQuestionOpsi([]);
        }
      };

      processOptionData();

    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat memuat analisis.");

      // Reset state jika perlu saat error
      setDataDiagramAvg(null);
      setDataPieChart(null);
      setDataTableRanking([]);
      setDataQuestionTableText({});
      setDataQuestionOpsi([]);
    }
  };

  // 🔹 Fetch pertama kali saat komponen mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const surveys = await listSurvey();
        if (surveys.length > 0) {
          const firstSurveyId = surveys[0].surveyId;
          setSurveyActive(firstSurveyId);
          await analysisSurvey(firstSurveyId, selectedFilter);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // 🔹 Update data saat `surveyActive` atau `selectedFilter` berubah
  useEffect(() => {
    if (!surveyActive) return;
    const fetchOnChange = async () => {
      setLoading(true);
      try {
        await analysisSurvey(surveyActive, selectedFilter);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOnChange();
  }, [surveyActive, selectedFilter]);

  const refreshAnalisisData = useCallback(async () => {
    if (!surveyActive) return;
    try {
      await Promise.all([
        analysisSurvey(surveyActive, selectedFilter)
      ]);
    } catch (error) {
      AlertFailed({ text: "Gagal memuat data terbaru" });
    } finally {
    }
  }, [socket]);

  useEffect(() => {
    const onConnect = () => {
      setIsSocketConnected(true);
      socket.emit('register-admin');
    };

    const onNewSurvey = (data) => {
      refreshAnalisisData();
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
  }, [refreshAnalisisData]);
  // ? unduh data ke dalam excel
  // ? data yang masuk harus berupa array of objects
  const exportExcel = (data, fileName, headers) => {
    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers }); // Mengubah data JSON ke worksheet
    const workbook = XLSX.utils.book_new(); // Membuat workbook baru
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data"); // Menambahkan worksheet ke workbook

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" }); // Konversi workbook ke array
    const file = new Blob([excelBuffer], { type: "application/octet-stream" }); // Membuat Blob

    saveAs(file, `${fileName}.xlsx`); // Mengunduh file
  };


  const handleDropdownChange = (event) => {
    return setSelectedFilter(event.target.value);
  }

  const handleChangeSurvey = (id) => {
    setSurveyActive(id);
  }

  const handleDownloadTableRanking = (dataTable) => {
    const headers = ['No', 'Pertanyaan', '4', '3', '2', '1', 'Rata-Rata', 'Ranking'];
    const dataExcel = dataTable.dataSurvei.analisis.map((item, index) => ({
      'No': index + 1,
      'Pertanyaan': item.pertanyaan,
      '4': item.nilai[0].jumlah,
      '3': item.nilai[1].jumlah,
      '2': item.nilai[2].jumlah,
      '1': item.nilai[3].jumlah,
      'Rata-Rata': item.avg,
      'Ranking': item.ranking
    }));
    exportExcel(dataExcel, 'Table-Ranking', headers);

  }
  const handleDownloadTableResponses = (dataTable) => {
    const analisis = dataTable.dataSurvei.analisis;
    // Buat header berdasarkan daftar pertanyaan
    const headers = ['No', ...analisis.map(item => item.pertanyaan)];
    // Ambil panjang maksimum dari array text
    const maxTextLength = Math.max(...analisis.map(item => item.text.length));
    // Susun data berdasarkan indeks dari isi text (baris per baris)
    const dataExcel = [];
    for (let i = 0; i < maxTextLength; i++) {
      const row = { 'No': i + 1 };
      analisis.forEach(item => {
        row[item.pertanyaan] = item.text[i] || ''; // jika undefined, isi string kosong
      });
      dataExcel.push(row);
    }
    exportExcel(dataExcel, 'Table-Text-Responses', headers);
  };

  return (
    <>
      <section className="py-5 px-5">
        <div className="relative bg-white rounded-xl shadow-md px-5 pt-5 pb-10">

          <div>
            <h1 className="text-lg font-bold text-gray-700">Hasil Analisis</h1>
            <p className="text-xs font-semibold text-gray-700/70">Survei Indeks Persepsi Kualitas Pelayanan & Anti Korupsi</p>
          </div>

          <div className="absolute top-5 right-5">
            <DropdownFilter value={selectedFilter} options={optionFilterValue} onChange={handleDropdownChange}></DropdownFilter>
          </div>

          <div className="flex flex-wrap justify-center gap-5 mt-8">
            {dataListSurveyActive.map((survey, index) => (
              <div className="mt-5" key={index} onClick={() => handleChangeSurvey(survey.surveyId)}>
                <h1 className={`text-sm border-2 text-center border-biru-tua shadow-md w-max cursor-pointer py-3 min-w-[250px] rounded-2xl ${surveyActive === survey.surveyId ? 'bg-biru-tua text-white font-semibold' : ' font-normal bg-white text-gray-700'}`}>{survey.title}</h1>
              </div>
            ))}
          </div>

          <div className="mt-20 flex justify-center">
            <CircleProgressbar dataSurvey={dataDiagramAvg} width={'max-w-[250px]'} sizeFont='text-xl'></CircleProgressbar>
          </div>

          <div className="flex flex-wrap justify-center gap-10 items-center mt-10">
            {dataPieChart.map((chart, index) => (
              <div className="bg-white relative rounded-md border-[1px] border-gray-700/60 shadow-lg" key={index}>
                <div className="absolute top-5 right-5">
                  < ButtonDownload color="bg-white"
                    icon={<MdOutlineFileDownload />}
                    onClick={() => downloadImage("pie", index)} />
                </div>
                <div className="px-5 pt-2 pb-2 border-b-[1px] border-gray-700/60">
                  <h1 className="text-base font-bold text-gray-700 mb-1">{chart.namaChart}</h1>
                  <span className="text-xs inline-block h-max text-gray-700 px-2 py-0.5 border-1 border-gray-700/60 rounded-sm bg-white">{optionFilterValue.find(item => item.value === selectedFilter).label || '-'}</span>
                </div>
                <div ref={(el) => (chartRefs.current.pie[index] = el)} className="p-5">
                  <h1 className="text-base text-center font-bold mb-1">{chart.namaChart.toUpperCase()}</h1>
                  <PieChart data={chart.data} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 flex w-full flex-col items-center">
            <div className="text-center mb-20">
              <h1 className="text-lg font-bold text-gray-700">Analisis Jawaban Hasil {dataListSurveyActive.filter(item => item.surveyId === surveyActive)[0]?.title || '-'}</h1>
            </div>
            <div className="relative">
              <div className="flex gap-2 absolute -top-15 right-0 ">
                <span className="text-xs font-semibold inline-block h-max text-white px-5 py-2 border-1  rounded-xl bg-biru-gelap">{optionFilterValue.find(item => item.value === selectedFilter).label || '-'}</span>
                < ButtonDownload color="bg-white" icon={<MdOutlineFileDownload className="text-lg" />} onClick={() => handleDownloadTableRanking(dataTableRanking)} text="Unduh" style="text-xs px-4" />
              </div>
              <div>
                <RankingTable data={dataTableRanking} header={dataHeaderRanking} width="w-[850px]"></RankingTable>
              </div>
            </div>
          </div>

          {Object.keys(dataQuestionTableText).length === 0 ? null :
            <div className="mt-20 pt-15 flex w-full flex-col items-center">
              <div className="relative">
                <div className="flex gap-2 absolute -top-15 right-0">
                  <span className="text-xs font-semibold inline-block h-max text-white px-5 py-2 border-1  rounded-xl bg-biru-gelap">{optionFilterValue.find(item => item.value === selectedFilter).label || '-'}</span>
                  < ButtonDownload color="bg-white" icon={<MdOutlineFileDownload className="text-lg" />} onClick={() => handleDownloadTableResponses(dataQuestionTableText)} text="Unduh" style="text-xs px-4" />
                </div>
                <div>
                  <ResponsesTable data={dataQuestionTableText} header={headerPertanyaanText()} width="w-[850px]" />
                </div>
              </div>
            </div>
          }
          {Object.keys(dataQuestionOpsi).length === 0 ? null :
            dataQuestionOpsi.map((dataChart, index) => (

              <div key={index} className="mt-20 pt-15 relative w-max">
                <div className="flex gap-2 absolute top-3 right-0">
                  <span className="text-xs font-semibold inline-block h-max text-white px-5 py-2 border-1  rounded-xl bg-biru-gelap">{optionFilterValue.find(item => item.value === selectedFilter).label || '-'}</span>
                  < ButtonDownload
                    color="bg-white"
                    icon={<MdOutlineFileDownload className="text-lg" />}
                    onClick={() => downloadImage("bar", index)}
                    text="Unduh"
                    style="text-xs px-4" />
                </div>
                <div className="border-1 border-gray-700/60 rounded-xl pl-0 box-border shadow-md" >
                  <div className="p-5" ref={(el) => (chartRefs.current.bar[index] = el)}>
                    <BarChartHorizontal data={dataChart} height="h-[200px]" width="w-[850px]" />
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </section >
    </>
  )
}
export default Analysis