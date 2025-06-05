import { ResponsiveBar } from '@nivo/bar';

const BarChartHorizontal = ({ data, height = "h-[200px]", width }) => {
  const dataChart = data.responsesOption
  return (
    <div>
      <div className="ml-5 max-w-4/5">
        <h1 className="text-md font-semibold text-gray-700">{data.questionText}</h1>
      </div>
      <div className={`${height} ${width}`}>
        <ResponsiveBar
          data={dataChart}
          keys={['value']}
          indexBy="label"
          layout="horizontal"
          margin={{ top: 0, right: 20, bottom: 50, left: 60 }}
          padding={0.7}
          colors={{ scheme: 'pastel1' }}
          borderRadius={5}
          borderColor={{ from: 'color', modifiers: [['darker', 1.2]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            legend: 'Jumlah Jawaban',
            legendPosition: 'middle',
            legendOffset: 40,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
          }}
          enableLabel={true}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </div>
    </div>
  );
};

export default BarChartHorizontal;