import { ResponsiveLine } from '@nivo/line';

const LineChart = ({ data, height }) => {
  return (
    <>
      <div className='w-full overflow-x-auto'>
        <div className={`min-w-[600px] ${height} overflow-hidden`}>

          <ResponsiveLine
            data={data}
            // height={400}
            animate
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
              legend: 'Bulan',
              legendOffset: 36,
              legendPosition: 'middle'
            }}
            axisLeft={{
              orient: 'left',
              legend: 'Jumlah Responden',
              legendOffset: -40,
              legendPosition: 'middle'
            }}
            curve="monotoneX"
            colors={{ scheme: 'category10' }}
            enablePoints={true}
            pointSize={10}
            pointColor="#41b9ff"
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            enablePointLabel={true}
            enableTouchCrosshair
            initialHiddenIds={[
              'cognac'
            ]}
            pointSymbol={({ size, color }) => (
              <circle
                r={size / 2}
                fill={color}
                stroke="white"
                strokeWidth={2}
              />
            )}
          />
        </div>
      </div>
    </>
  )
}
export default LineChart