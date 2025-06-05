import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';

const RangkingTable = ({ data, header, width }) => {
  const lengthQuestion = data?.dataSurvei?.analisis?.length
  const warningRanking = 3
  const lowRanking = data?.dataSurvei?.analisis?.filter(row => row.ranking > (lengthQuestion - warningRanking))
  return (
    <>
      <div className={`overflow-x-auto ${width}`}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#e0e0e0', }}>
                {header.map((item, index) => (
                  <TableCell key={index} sx={{ borderRight: '1px solid #ccc', paddingTop: 0.5, paddingBottom: 1, textAlign: 'center', fontWeight: 'bold' }}>{item}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.dataSurvei?.analisis?.map((row, index) => (
                <TableRow key={row.id} sx={{
                  backgroundColor:
                    lowRanking.some(item => item.id === row.id)
                      ? '#ff6244 ' // hijau muda
                      : "#ffffff",
                  color:
                    lowRanking.some(item => item.id === row.id)
                      ? '#ffffff' // hijau muda 
                      : "#000000"
                }}>
                  <TableCell sx={{
                    borderRight: '1px solid #ccc', color: lowRanking.some(item => item.id === row.id) ? '#ffffff' : "#000000"
                  }}>{index + 1 + "."}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #ccc', color: lowRanking.some(item => item.id === row.id) ? '#ffffff' : "#000000" }}>{row.pertanyaan}</TableCell>
                  {row.nilai.map((item, index) => (
                    <TableCell align="center" key={`${row.id}-${item.id}`} sx={{ borderRight: '1px solid #ccc', color: lowRanking.some(item => item.id === row.id) ? '#ffffff' : "#000000" }}>{item.jumlah}</TableCell>
                  ))}
                  <TableCell sx={{ borderRight: '1px solid #ccc', textAlign: 'center', color: lowRanking.some(item => item.id === row.id) ? '#ffffff' : "#000000" }}>{row.avg}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #ccc', textAlign: 'center', color: lowRanking.some(item => item.id === row.id) ? '#ffffff' : "#000000" }}>{row.ranking}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  )
}
export default RangkingTable