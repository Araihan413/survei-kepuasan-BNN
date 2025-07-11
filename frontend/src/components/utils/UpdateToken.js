import { useNavigate } from "react-router-dom";
import { AlertTokenExpired } from "../Elements/Alert";

export const updateAccessToken = (accessToken) => {
  const navigasi = useNavigate();
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  } else {
    console.log("Token tidak ada");
    localStorage.removeItem("accessToken");
    AlertTokenExpired();
    navigasi("/login");
  }
};

