import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import KebabMenu from '../Elements/KebabMenu';

const ManageQuestionTable = ({ data, header, width = "" }) => {

  return (
    <>
      <div className={`overflow-x-auto ${width}`}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow >
                {header.map((item, index) => (
                  <TableCell key={index} sx={{ paddingTop: 0.5, paddingBottom: 1, textAlign: 'center', fontWeight: 'bold' }}>{item}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ paddingTop: 0.5, paddingBottom: 1, textAlign: 'center' }}>{item.id}</TableCell>
                  <TableCell sx={{ paddingTop: 0.5, paddingBottom: 1, textAlign: 'center' }}>{item.type}</TableCell>
                  <TableCell sx={{ paddingTop: 0.5, paddingBottom: 1, textAlign: 'center', minWidth: 400 }}>{item.pertanyaan}</TableCell>
                  <TableCell sx={{ paddingTop: 0.5, paddingBottom: 1, textAlign: 'center' }}>{item.admin}</TableCell>
                  <TableCell sx={{ paddingTop: 0.5, paddingBottom: 1, textAlign: 'center' }}><KebabMenu onDelete={() => { }} onEdit={() => { }} onDetail={() => { }} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  )
}
export default ManageQuestionTable