import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `https://life-nest-company-server.vercel.app`,
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
