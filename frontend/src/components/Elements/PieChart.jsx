import { ResponsivePie } from "@nivo/pie";


const PieChart = ({ data, width = 330, height = 200 }) => {
  const filteredData = data.filter(item => item.value > 0);
  return (
    <>
      {filteredData.length > 0 ? (
        <div className={`h-[200px] w-[330px]`}>
          <ResponsivePie
            width={width}
            activeOuterRadiusOffset={8}
            innerRadius={0}
            animate
            data={filteredData}
            height={height}
            padAngle={0.5}
            enableArcLinkLabels={false}
            cornerRadius={3}
            arcLabel={e => `${((e.value / filteredData.reduce((acc, item) => acc + item.value, 0)) * 100).toFixed(1)}%`}
            arcLinkLabelsColor={{
              from: 'color'
            }}
            arcLinkLabelsThickness={3}
            // arcLabelsTextColor="#ffffff"
            arcLinkLabelsTextColor={{
              from: 'color',
              modifiers: [['darker', 1.2]]
            }}
            colors={{ datum: "data.color" }}
            legends={[
              {
                anchor: 'right',
                direction: 'column',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemTextColor: '#000',
                    }
                  }
                ],
                itemHeight: 18,
                itemTextColor: '#999',
                itemWidth: 100,
                symbolShape: 'circle',
                symbolSize: 14,
                toggleSerie: true,
                translateY: 0,
                translateX: 105
              }
            ]}
            margin={{
              bottom: 20,
              left: 5,
              right: 150,
              top: 20
            }}
            theme={{
              text: {
                fontFamily: '\'SFMono-Regular\', Consolas, \'Liberation Mono\', Menlo, Courier, monospace',
                fontWeight: 600
              }
            }}

          />
        </div>
      ) : (
        <div className="flex justify-center items-center h-[200px] w-[330px]">Data Kosong</div>
      )}

    </>
  )
}
export default PieChart