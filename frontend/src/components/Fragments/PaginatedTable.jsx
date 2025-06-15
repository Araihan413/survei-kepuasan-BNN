import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Paper
} from '@mui/material';
import { useState } from 'react';

const PaginatedTable = ({ dataPerSlide = 10, header, data }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = dataPerSlide;

  const displayedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  return (
    <>
      <div className='overflow-x-auto w-full flex justify-center'>
        <TableContainer component={Paper} className="w-full max-w-[1000px] mt-5">
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {header.map((item, index) => (
                  <TableCell key={index} sx={{ fontWeight: 'bold' }}>{item}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData.map((item, index) => (
                <TableRow key={item.no}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>{item.nama}</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>{item.pekerjaan}</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>{item.layanan}</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>{item.waktu}</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>{item.jenisSurvei}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[10]} // Hanya 10 per halaman
            component="div"
            count={data.length}       // Total data
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
          />
        </TableContainer>
      </div>
    </>
  );
}
export default PaginatedTable