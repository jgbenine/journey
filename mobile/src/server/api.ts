import axios from "axios"

// axios.defaults.validateStatus = false;
export const api = axios.create({
  baseURL: "http://192.168.0.134:3333",
})


