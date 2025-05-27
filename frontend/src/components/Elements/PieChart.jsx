import { ResponsivePie } from "@nivo/pie";

const data = [
  { id: "A", label: "A", value: 3.88, color: "#00C49F" },
  { id: "B", label: "Sisa", value: 0.12, color: "#eee" },
];
const PieChart = () => {
  return (
    <>
      <div style={{ height: 300 }}>
        <ResponsivePie
          data={data}
          innerRadius={0}
          padAngle={1}
          cornerRadius={3}
          colors={{ datum: "data.color" }} // ambil warna dari data.color
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          enableArcLabels={false}
          enableArcLinkLabels={false}
        />
      </div>
    </>
  )
}
export default PieChart