import { useRef, useState, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import { FaPalette } from 'react-icons/fa';

const ColorPicker = ({ bgColor, handleChangeTheme }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  const handleClickOutside = (event) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      setShowPicker(false);
    }
  };

  useEffect(() => {
    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div className="relative inline-block">
      <FaPalette
        className="text-xl text-gray-700 cursor-pointer hover:text-blue-500"
        onClick={() => setShowPicker(!showPicker)}
      />

      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute z-50 mt-2"
          style={{ willChange: 'transform, opacity' }}
        >
          <SketchPicker
            color={bgColor}
            onChangeComplete={(color) => handleChangeTheme(color.hex)}
          />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
