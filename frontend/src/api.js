import axios from "axios";

// Eğer tarayıcıdaki adres "localhost" ise localhost'u kullan,
// Değilse (AWS'de ise) sunucunun IP adresini kullan.
const hostname = window.location.hostname;
const api = axios.create({
    baseURL: `http://${hostname}:3000`,
});

export default api;
