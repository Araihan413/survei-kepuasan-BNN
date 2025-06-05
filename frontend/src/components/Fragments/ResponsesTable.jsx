import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';

const ResponsesTable = ({ data, header, width = "" }) => {

  const tableRow = []

  for (let i = 0; i < Number(data.dataSurvei.jumlahResponden); i++) {
    tableRow.push(
      <TableRow key={i}>
        <TableCell sx={{ borderRight: '1px solid #ccc', maxWidth: 50 }}>{i + 1 + "."}</TableCell>
        {data.dataSurvei.analisis.map((item, index) => (
          <TableCell key={index} sx={{ borderRight: '1px solid #ccc', minWidth: 200 }}>{item.text[i]}</TableCell>
        ))}
      </TableRow>
    )
  }
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
              {tableRow}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  )
}
export default ResponsesTable