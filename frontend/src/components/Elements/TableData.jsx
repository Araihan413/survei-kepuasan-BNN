import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Paper
} from '@mui/material';
import { MdFilterAlt } from "react-icons/md";
import { useState } from 'react';

const data = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  category: i % 2 === 0 ? 'Elektronik' : 'Buah'
}));

const TableData = () => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const displayedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  return (
    <>
      <div>
        <TableContainer component={Paper} className="max-w-4xl mx-auto mt-8">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Nama Barang</TableCell>
                <TableCell>Kategori</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
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
export default TableData