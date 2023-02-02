import axios from "axios";
import { authHeader } from "../helpers/utils";

export const api = axios.create({
  baseURL: "http://192.168.8.108:3036",
  timout: 3000,
  headers: authHeader(),
});

const userSignIn = async ({ username }) => {
  try {
    const { data: response } = await api.post("/api/auth/signin", { username });
    if (!response.success) throw response;

    setAuthentication(response.data);
    return response;
  } catch (error) {
    console.log(
      `SERVICE AUTH FAILED\nError\t: ${error.name}\nCode\t: ${error.code}\nMessage\t: ${error.message}`
    );
    console.log("ini config", error.config);
    return error;
  }
};

const userSignOut = async () => {
  try {
    const { data: response } = await api.post("/api/auth/signout");

    if (!response.success) throw response;
    setAuthentication(null, "remove");
    return response;
  } catch (error) {
    console.log(
      `SERVICE AUTH FAILED\nError\t: ${error.name}\nCode\t: ${error.code}\nMessage\t: ${error.message}`
    );
    console.log("error saat request", error.request);
    setAuthentication(null, "remove");

    return error;
  }
};

const setAuthentication = (data, set = "set") => {
  set === "set"
    ? localStorage.setItem("user-data", JSON.stringify(data))
    : localStorage.removeItem("user-data");
  return (api.defaults.headers.common["Authorization"] =
    data.token === null ? null : `Bearer ${data.token}`);
};

export default {
  userSignIn,
  userSignOut,
  setAuthentication,
};
