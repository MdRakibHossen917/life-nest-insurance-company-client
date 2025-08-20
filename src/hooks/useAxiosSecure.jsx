import axios from "axios";
import useAuth from "./useAuth";

const useAxiosSecure = () => {
  const { user } = useAuth();

  const instance = axios.create({
    baseURL: "https://life-nest-company-server.vercel.app",
  });

  instance.interceptors.request.use(
    async (config) => {
      if (user) {
        const token = await user.getIdToken(); // ✅ Now works
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

export default useAxiosSecure;
