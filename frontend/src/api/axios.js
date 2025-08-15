import axios from 'axios';
axios.defaults.withCredentials = true;
const BASE_URL = 'http://localhost:8000'; // process.env.REACT_APP_API_URL ||

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json'
     },
    
    withCredentials: true
});