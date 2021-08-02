import axios from "axios";

const instance = axios.create({
  baseURL: "https://eventscape-staging.herokuapp.com/",
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log(err);
    return Promise.reject(err);
  }
);

export default instance;
