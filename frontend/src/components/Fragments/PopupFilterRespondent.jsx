import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import urlApi from "../../api/urlApi"

const PopupFilterRespondent = ({ open, onClose, onApplyFilter }) => {
  const [listService, setListService] = useState([])
  const [listJob, setListJob] = useState([])
  const [listTypeSurvey, setListTypeSurvey] = useState([])
  const [dataFilter, setDataFilter] = useState({ job: '', serviceId: '', surveyId: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    const fetchDataSevice = async () => {
      try {
        const response = await fetch(`${urlApi}/service`)
        const dataServices = await response.json()
        if (!response.ok) {
          throw new Error(dataServices.message || dataServices.error);
        }
        const service = dataServices.data.map(item => ({ value: item.serviceId, label: item.label }))
        const optionService = [{ value: "", label: 'Semua Layanan' }, ...service]
        setListService(optionService)
      } catch (error) {
        setError(error.message);
      }
    }

    const fetchDataJob = async () => {
      const field = 'job'
      try {
        const response = await fetch(`${urlApi}/question/${field}/option`)
        const dataJob = await response.json()
        if (!response.ok) {
          throw new Error(dataJob.message || dataJob.error);
        }
        const job = dataJob.data.option.map(item => ({ value: item.optionText, label: item.optionText }))
        const optionJob = [{ value: "", label: 'Semua Pekerjaan' }, ...job]
        setListJob(optionJob)
      } catch (error) {
        setError(error.message);
      }
    }

    const fetchDataTypeSurvey = async () => {
      try {
        const response = await fetch(`${urlApi}/survey`)
        const dataTypeSurvey = await response.json()
        if (!response.ok) {
          throw new Error(dataTypeSurvey.message || dataTypeSurvey.error);
        }
        const typeSurvey = dataTypeSurvey.data
          .filter(item => item.isPersonal === true)
          .map(item => ({
            value: item.surveyId,
            label: item.title
          }))
        const optionTypeSurvey = [{ value: "", label: 'Semua Survei' }, ...typeSurvey]
        setListTypeSurvey(optionTypeSurvey)
      } catch (error) {
        setError(error.message);
      }
    }
    fetchDataTypeSurvey()
    fetchDataJob()
    fetchDataSevice()
    setLoading(false)
  }, [open])

  const handleChangeService = (e) => {
    setDataFilter({ ...dataFilter, [e.target.name]: e.target.value })
  }
  const handleChangeJob = (e) => {
    setDataFilter({ ...dataFilter, [e.target.name]: e.target.value })
  }
  const handleChangeSurvey = (e) => {
    setDataFilter({ ...dataFilter, [e.target.name]: e.target.value })
  }

  const handleFilter = (e) => {
    e.preventDefault()

    if (typeof onApplyFilter !== 'function') {
      console.warn('onApplyFilter tidak tersedia');
      return;
    }
    onApplyFilter(dataFilter)
    onClose()
  }

  return (
    <>
      <div>
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
          <DialogTitle>Filter Respondent</DialogTitle>
          {loading ? <div className='text-center w-full h-full text-blue-400'><p>Loading...</p></div> :
            <form onSubmit={(e) => handleFilter(e)} >
              <DialogContent sx={{ minHeight: 300, overflowY: 'auto' }}>
                <div className='flex gap-2 justify-center'>
                  <div className='flex flex-col gap-2 w-60'>
                    <label htmlFor="layanan" className='font-bold text-lg text-center'>Layanan</label>
                    <select value={dataFilter.serviceId} name="serviceId" id="layanan" className='w-full text-center py-2' onChange={handleChangeService}>
                      {listService.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className='flex flex-col gap-2 w-60'>
                    <label htmlFor="pekerjaan" className='font-bold text-lg text-center'>Pekerjaan</label>
                    <select value={dataFilter.job} name="job" id="pekerjaan" className='w-full text-center py-2' onChange={handleChangeJob}>
                      {listJob.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className='flex flex-col gap-2 w-60'>
                    <label htmlFor="survei" className='font-bold text-lg text-center'>Jenis Survei</label>
                    <select value={dataFilter.surveyId} name="surveyId" id="survei" className='w-full text-center py-2' onChange={handleChangeSurvey}>
                      {listTypeSurvey.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </DialogContent>
              <DialogActions>
                <Button type='submit' onSubmit={handleFilter} sx={{ color: 'white', fontWeight: 'bold', backgroundColor: '#0575E6' }}>Terapkan</Button>
                <Button onClick={onClose}>Tutup</Button>
              </DialogActions>
            </form>
          }
        </Dialog>
      </div>
    </>
  )
}

export default PopupFilterRespondent