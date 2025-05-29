import { ResponsiveBar } from '@nivo/bar';

const BarChartHorizontal = ({ data, height = "h-[200px]", width }) => {
  return (
    <div className={`${height} ${width}`}>
      <ResponsiveBar
        data={data}
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
  );
};

export default BarChartHorizontal;