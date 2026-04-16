import axios from 'axios'

const api = axios.create({
  baseURL: 'https://primetrade-backend-assingnment.onrender.com/api',
  withCredentials: true
})

export default api
