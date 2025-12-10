import axios from "axios";

// If url contains "localhost" use "localhost",
// If not (From AWS) use servers IP.
const hostname = window.location.hostname;
const api = axios.create({
    baseURL: `http://${hostname}:3000`,
});

export default api;
