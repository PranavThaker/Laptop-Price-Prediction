import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

export default api

export const getOptions = () => api.get("/options")

export const predictPrice = (data) => api.post("/predict", data)