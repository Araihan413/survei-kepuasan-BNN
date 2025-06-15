import { useEffect, useRef, useState } from 'react';
import { BiSolidImageAlt } from 'react-icons/bi';

const EditOnClickBanner = ({ bannerUrl, defaultBanner, onBannerChange }) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (bannerUrl) {
      setPreviewUrl(bannerUrl);
    }
  }, [bannerUrl]);
  const handleBannerClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      onBannerChange(file); // Kirim file ke parent
    }
  };

  return (
    <div className="h-max md:w-120 relative rounded-xl overflow-hidden cursor-pointer">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <img
        src={previewUrl || bannerUrl || defaultBanner}
        alt="banner survei"
        className="w-full"
      />
      <div
        className="flex justify-center items-center opacity-0 w-full h-full absolute bg-white/0 hover:bg-white/10 hover:backdrop-blur-xs hover:opacity-100 z-10 top-0"
        onClick={handleBannerClick}
      >
        <div className="flex gap-2">
          <BiSolidImageAlt className="text-2xl text-gray-800" />
          <p className="text-gray-800 font-bold">Tambahkan Gambar</p>
        </div>
      </div>
    </div>
  );
};

export default EditOnClickBanner;