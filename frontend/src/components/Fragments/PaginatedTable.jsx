import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Paper
} from '@mui/material';
import { useState } from 'react';

const headerTable = ["No.", "Nama", "Pekerjaan", "Layanan", "Waktu", "Jenis Survei"];

const data = Array.from({ length: 50 }, (_, i) => ({
  no: i + 1,
  nama: `responden ${i + 1}`,
  pekerjaan: i % 2 === 0 ? 'Mahasiswa' : 'PNS',
  layanan: i % 2 === 0 ? 'SKHPN' : 'Tes urin',
  waktu: i % 2 === 0 ? '2023-06-01' : '2023-06-02',
  jenisSurvei: i % 2 === 0 ? 'index kepuasan' : 'index anto korupsi',
}));



const PaginatedTable = ({ dataPerSlide = 10 }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = dataPerSlide;

  const displayedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  return (
    <>
      <div className='overflow-x-auto max-w-full'>
        <TableContainer component={Paper} className="max-w-full mt-8">
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {headerTable.map((item, index) => (
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