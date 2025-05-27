import { ResponsiveLine } from '@nivo/line';

const LineChart = ({ data }) => {
  return (
    <>
      <div className='w-full overflow-x-auto'>
        <div className='min-w-[600px] h-[300px] overflow-hidden'>
          <ResponsiveLine
            data={data}
            margin={{ top: 50, right: 10, bottom: 50, left: 50 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: false,
              reverse: false
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: 'bottom',
              legend: 'X axis',
              legendOffset: 36,
              legendPosition: 'middle'
            }}
            axisLeft={{
              orient: 'left',
              legend: 'Y axis',
              legendOffset: -40,
              legendPosition: 'middle'
            }}
            colors={{ scheme: 'category10' }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
          />
        </div>
      </div>
    </>
  )
}
export default LineChart