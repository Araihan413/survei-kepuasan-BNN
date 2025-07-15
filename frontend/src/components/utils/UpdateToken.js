import { useNavigate } from "react-router-dom";
import { AlertTokenExpired } from "../Elements/Alert";

// Hook untuk mengelola update access token & redirect jika gagal
const useUpdateAccessToken = () => {
  const navigate = useNavigate();

  return async (accessToken) => {
    if (accessToken) {
      // ✅ Simpan access token baru
      localStorage.setItem("accessToken", accessToken);
    } else {
      // ❌ Access token tidak tersedia — berarti refresh token gagal
      const confirmed = await AlertTokenExpired(); // Tampilkan alert

      if (confirmed) {
        // ✅ Hapus token lama (jika ada)
        localStorage.removeItem("accessToken");

        // ✅ Redirect ke halaman login
        navigate("/login");
      }
    }
  };
};

export default useUpdateAccessToken;
