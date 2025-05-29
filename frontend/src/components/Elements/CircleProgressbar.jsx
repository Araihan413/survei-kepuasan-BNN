import { useRef, useState } from "react";
import ButtonDownload from "./ButtonDownload";
import { MdOutlineFileDownload } from "react-icons/md";
import DropdownColor from "./DropdownColor";
import { FaCircle } from "react-icons/fa";
import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";
import html2canvas from "html2canvas";
import "react-circular-progressbar/dist/styles.css";


const CircleProgressbar = (props) => {
  const { dataSurvey, width = 'max-w-[200px]', sizeFont = 'text-lg', hiddenDownload = false, hiddenColor = false } = props
  const { avgValue, maxValue, nameSurvey } = dataSurvey
  const value = avgValue;
  const max = maxValue;
  const ref = useRef(null);

  // ? filter warna
  const optionValue = [
    { value: '#1bdd24', label: 'Hijau', icon: <FaCircle className="text-[#1bdd24]" /> },
    { value: '#e72525', label: 'Merah', icon: <FaCircle className="text-[#e72525]" /> },
    { value: '#0cd2d8', label: 'Tosca', icon: <FaCircle className="text-[#0cd2d8]" /> },
    { value: '#00abdb', label: 'Biru', icon: <FaCircle className="text-[#00abdb]" /> },
    { value: '#f231ef', label: 'Pink', icon: <FaCircle className="text-[#f231ef]" /> },
    { value: '#7831f2', label: 'Ungu', icon: <FaCircle className="text-[#7831f2]" /> },
  ]
  const [selectedOption, setSelectedOption] = useState(optionValue[0].value);

  const handleChangeColor = (event) => {
    return setSelectedOption(event.target.value);
  }
  const downloadImage = () => {
    html2canvas(ref.current, { backgroundColor: null }).then(canvas => {
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "diagram.png";
      a.click();
    });
  };

  return (
    <>
      <div className="flex flex-col relative w-max">
        <div className="flex justify-end absolute top-0 -right-28 gap-3">
          {!hiddenColor &&
            <DropdownColor value={selectedOption} options={optionValue} handleChange={handleChangeColor} label="Pilih Warna"></DropdownColor>}
          {!hiddenDownload &&
            <ButtonDownload type="button" color="bg-white" icon={<MdOutlineFileDownload />} onClick={downloadImage}></ButtonDownload>}
        </div>
        <div ref={ref} className={`flex flex-col items-center p-5 bg-transparent ${width} overflow-hidden`}>
          <div className="w-full max-w-[300px] aspect-square font-bold p-5 box-border">
            <CircularProgressbar
              value={value}
              maxValue={max}
              text={`${value.toFixed(2)}`}
              strokeWidth={18}
              styles={buildStyles({
                pathColor: '#00C49F',
                textColor: "#333",
                trailColor: "#ffffff",
                textSize: "18px",
                backgroundColor: "#f23131",
              })}
            />
          </div>
          <div>
            <h1 className={`text-center ${sizeFont} font-semibold`}>{nameSurvey}</h1>
          </div>
        </div>
      </div>
    </>
  );
}
export default CircleProgressbar