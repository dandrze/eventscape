import axios from "axios";
import { toast } from "react-toastify";

const instance = axios.create({
  baseURL: "/",
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log(err);
    return Promise.reject(err);
  }
);

export default instance;
