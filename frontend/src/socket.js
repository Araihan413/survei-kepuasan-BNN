import { io } from "socket.io-client";

const socket = io("http://localhost:2100"); // sesuaikan dengan backend kamu
export default socket;