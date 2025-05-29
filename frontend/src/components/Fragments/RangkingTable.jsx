import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';

const RangkingTable = ({ data, header, width }) => {
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
              {data.dataAnalisis.pertanyaan.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ borderRight: '1px solid #ccc' }}>{index + 1 + "."}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #ccc' }}>{row.pertanyaan}</TableCell>
                  {row.nilai.map((item, index) => (
                    <TableCell align="center" key={index} sx={{ borderRight: '1px solid #ccc' }}>{item.jumlah}</TableCell>
                  ))}
                  <TableCell sx={{ borderRight: '1px solid #ccc', textAlign: 'center' }}>{row.avg}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #ccc', textAlign: 'center' }}>{row.ranking}</TableCell>
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