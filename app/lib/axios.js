// lib/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api', // //'https://e4a8-2605-59c8-342a-f410-7c96-1a52-b105-428a.ngrok-free.app/',
  withCredentials: true,
});

export default instance;
