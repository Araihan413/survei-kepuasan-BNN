const dashboardRepository = require('./dashboard.repository')
const { startOfMonth, startOfDay, startOfWeek, subMonths, subWeeks, subDays, format } = require('date-fns')

const getStartDate = (rangeDate) => {
  const now = new Date();
  switch (rangeDate) {
      case 'daily':
        startDateSearch = subDays(startOfDay(now), 1);
        break;
      case 'weekly':
        startDateSearch = subWeeks(startOfWeek(now), 1);
        break;
      case '1month':
        startDateSearch = subMonths(startOfMonth(now), 1);
        break;
      case '3month':
        startDateSearch = subMonths(startOfMonth(now), 3);
        break;
      case '6month':
        startDateSearch = subMonths(startOfMonth(now), 6);
        break;
      case '12month':
        startDateSearch = subMonths(startOfMonth(now), 12);
        break;
      default:
        throw new Error('Invalid rangeDate');
    }

    return startDateSearch
}

const getRespondenByYear = async (year, serviceId) => {
  const dataRespondents = await dashboardRepository.respondentsPerMonth(year, serviceId)

  // Hitung jumlah responden per bulan
  const countByMonth = {};

  dataRespondents.forEach(item => {
    const month = format(item.createdAt, 'yyyy-MM');
    if (!countByMonth[month]) countByMonth[month] = 0;
    countByMonth[month]++;
  });

  // Buat array semua bulan dari Januari sampai Desember
  const allMonths = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, '0');
    return `${year}-${month}`;
  });

  // Gabungkan agar bulan kosong tetap muncul dengan count = 0
  const result = allMonths.map(month => ({
    month,
    count: countByMonth[month] || 0
  }));
  return result

  }

const getRecentRespondentsByFilter = async (date, name, job, service, typeSurvey) => {
  const startDate = getStartDate(date)
  const dataRespondents = await dashboardRepository.recentRespondents(startDate)

  const resultDataRespondents = []

dataRespondents.forEach((respondent) => {
  if (name && respondent.name !== name) return
  if (job && respondent.job !== job) return
  if (service && respondent.service.name !== service) return
  if (typeSurvey && lowercase(respondent.survey.title) !== lowercase(typeSurvey)) return
  resultDataRespondents.push(respondent)
})
  return resultDataRespondents
}


const getAvgScoreSurvey = async (date) => {
  const startDate = getStartDate(date)
  const dataAvgScore = await dashboardRepository.avgScorePerSurvey(startDate)
  return dataAvgScore
}


// const getDashboard = async (date, year) => {
//   const startDate = getStartDate(date)

//   const dataRespondents = await getRespondenByYear(year)
//   const dataAvgScore = await getAvgScoreSurvey(startDate)
//   const dataRecentRespondents = await getRecentRespondentsByFilter(startDate)

//   return { dataRespondents, dataAvgScore, dataRecentRespondents }
// }


module.exports = { getRespondenByYear, getRecentRespondentsByFilter, getAvgScoreSurvey }