import axios, { AxiosInstance } from "axios";

class RequestService {
  axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: "//localhost:3000/",
      timeout: 1000,
    });
  }

  get(url: string) {
    return this.axios.get(url);
  }

  post(url: string, data: any) {
    return this.axios.post(url, data);
  }

  put(url: string, data: any) {
    return this.axios.put(url, data);
  }

  setJwt(jwt: string) {
    this.axios = axios.create({
      baseURL: "//localhost:3000/",
      timeout: 1000,
      headers: { Authorization: `Bearer ${jwt}` },
    });
  }
}

const requestService = new RequestService();

export default requestService;
