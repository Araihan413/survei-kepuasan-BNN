import { use, useState } from 'react';
import { HiPencil } from 'react-icons/hi';
import { useEffect } from 'react';

const EditableTextInformation = ({ initialText, defaultText, onTextChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText || '');
  useEffect(() => {
    setText(initialText);
  }, [initialText]);


  const handleTextClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onTextChange(text); // Kirim perubahan ke parent
  };

  return (
    <div className="w-full md:w-120 h-max bg-white shadow-md rounded-xl relative overflow-hidden cursor-pointer text-center">
      {isEditing ? (
        <textarea
          className="p-5 w-full h-full focus:outline-none resize-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <>
          <h1 className="p-5">{text || defaultText}</h1>
          <div
            className="flex justify-center items-center opacity-0 w-full h-full absolute bg-white/0 hover:bg-white/10 hover:backdrop-blur-xs hover:opacity-100 z-10 top-0"
            onClick={handleTextClick}
          >
            <div className="flex gap-2">
              <HiPencil className="text-2xl text-gray-800" />
              <p className="text-gray-800 font-bold">Edit Tulisan</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EditableTextInformation;